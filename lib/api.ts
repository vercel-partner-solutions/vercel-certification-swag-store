import type {
  ApiError,
  CartWithProducts,
  CategorySlug,
  Category,
  PaginationMeta,
  Product,
  Promotion,
  StockInfo,
  StoreConfig,
} from "./types";

const API_BASE_URL =
  process.env.API_BASE_URL ??
  "https://vercel-agentic-swag-store-api.vercel.app/api";
const PROTECTION_BYPASS = process.env.BYPASS_SECRET ?? "";

const DEFAULT_REVALIDATE = 300; // 5 minutes for read endpoints

interface RequestOptions {
  method?: string;
  body?: unknown;
  cartToken?: string;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: { pagination?: PaginationMeta };
}

interface ApiFailure {
  success: false;
  error: ApiError;
}

type ApiResult<T> = ApiSuccess<T> | ApiFailure;

// Append the Vercel deployment-protection bypass as a query param.
// Some protection configurations only honor the bypass via query (the header
// variant requires a cookie round-trip that server-side `fetch` won't follow).
function withBypass(path: string): string {
  const url = `${API_BASE_URL}${path}`;
  if (!PROTECTION_BYPASS) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}x-vercel-protection-bypass=${encodeURIComponent(PROTECTION_BYPASS)}`;
}

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(
    status: number,
    code: string | undefined,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, cartToken, cache, next } = options;

  const headers: Record<string, string> = {
    "x-vercel-protection-bypass": PROTECTION_BYPASS,
  };
  if (cartToken) headers["x-cart-token"] = cartToken;
  if (body !== undefined) headers["content-type"] = "application/json";

  const init: RequestInit & { next?: RequestOptions["next"] } = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  if (cache) init.cache = cache;
  if (next) init.next = next;

  const res = await fetch(withBypass(path), init);

  let json: ApiResult<T> | undefined;
  try {
    json = (await res.json()) as ApiResult<T>;
  } catch {
    // ignore — handled below
  }

  if (!res.ok || !json || json.success === false) {
    const err = json && json.success === false ? json.error : undefined;
    throw new ApiRequestError(
      res.status,
      err?.code,
      err?.message ?? `API request failed: ${res.status} ${path}`,
      err?.details,
    );
  }

  return json.data;
}

// ---- Reads (cached) ----

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: CategorySlug | string;
  search?: string;
  featured?: boolean;
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.featured !== undefined)
    qs.set("featured", params.featured ? "true" : "false");

  const path = qs.toString() ? `/products?${qs}` : "/products";
  return request<Product[]>(path, {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["products"] },
  });
}

export async function getProductById(idOrSlug: string): Promise<Product> {
  return request<Product>(`/products/${encodeURIComponent(idOrSlug)}`, {
    next: {
      revalidate: DEFAULT_REVALIDATE,
      tags: ["products", `product:${idOrSlug}`],
    },
  });
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories", {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["categories"] },
  });
}

export async function getPromotion(): Promise<Promotion | null> {
  try {
    return await request<Promotion>("/promotions", {
      next: { revalidate: 60, tags: ["promotion"] },
    });
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) return null;
    throw err;
  }
}

export async function getStoreConfig(): Promise<StoreConfig> {
  return request<StoreConfig>("/store/config", {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["store-config"] },
  });
}

// ---- Live (uncached) ----

export async function getProductStock(idOrSlug: string): Promise<StockInfo> {
  return request<StockInfo>(`/products/${encodeURIComponent(idOrSlug)}/stock`, {
    cache: "no-store",
  });
}

// ---- Cart (uncached, token-scoped) ----

export async function cartCreate(): Promise<{
  token: string;
  cart: CartWithProducts;
}> {
  const res = await fetch(withBypass("/cart/create"), {
    method: "POST",
    headers: {
      "x-vercel-protection-bypass": PROTECTION_BYPASS,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new ApiRequestError(
      res.status,
      undefined,
      `cartCreate failed: ${res.status}`,
    );
  }
  const token = res.headers.get("x-cart-token") ?? "";
  const json = (await res.json()) as ApiResult<CartWithProducts>;
  if (!json.success) {
    throw new ApiRequestError(
      res.status,
      json.error.code,
      json.error.message,
      json.error.details,
    );
  }
  return { token: token || json.data.token, cart: json.data };
}

export async function cartGet(token: string): Promise<CartWithProducts> {
  return request<CartWithProducts>("/cart", {
    cartToken: token,
    cache: "no-store",
  });
}

export async function cartAdd(
  token: string,
  productId: string,
  quantity: number = 1,
): Promise<CartWithProducts> {
  return request<CartWithProducts>("/cart", {
    method: "POST",
    cartToken: token,
    body: { productId, quantity },
    cache: "no-store",
  });
}

export async function cartUpdate(
  token: string,
  productId: string,
  quantity: number,
): Promise<CartWithProducts> {
  return request<CartWithProducts>(`/cart/${encodeURIComponent(productId)}`, {
    method: "PATCH",
    cartToken: token,
    body: { quantity },
    cache: "no-store",
  });
}

export async function cartRemove(
  token: string,
  productId: string,
): Promise<CartWithProducts> {
  return request<CartWithProducts>(`/cart/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    cartToken: token,
    cache: "no-store",
  });
}
