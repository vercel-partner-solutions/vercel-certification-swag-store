import type {
  ApiError,
  BackOfficeDateRangeMeta,
  BackOfficeReturnDecision,
  BackOfficeReturnStatus,
  BackOfficeSalesMeta,
  BackOfficeStockMeta,
  CartWithProducts,
  CategorySlug,
  Category,
  PaginationMeta,
  Product,
  ProductSalesRow,
  Promotion,
  StockEntry,
  StockInfo,
  StoreConfig,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
  Order,
  Return,
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

interface ApiSuccess<T, M = { pagination?: PaginationMeta }> {
  success: true;
  data: T;
  meta?: M;
}

interface ApiFailure {
  success: false;
  error: ApiError;
}

interface CreateReturnInput {
  orderId: string;
  items: { productId: string; quantity: number }[];
  reason: string;
  callback?: string; // used in phase 3
}

type ApiResult<T, M = { pagination?: PaginationMeta }> =
  | ApiSuccess<T, M>
  | ApiFailure;

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

// Variant of `request` that returns both `data` and `meta`. Used by
// back-office endpoints whose `meta` carries information you actually want
// (date windows, aggregate totals, pagination) rather than just bookkeeping.
async function requestWithMeta<T, M>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta: M }> {
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

  let json: ApiResult<T, M> | undefined;
  try {
    json = (await res.json()) as ApiResult<T, M>;
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

  if (json.meta === undefined) {
    throw new ApiRequestError(
      res.status,
      undefined,
      `API response missing meta: ${path}`,
    );
  }

  return { data: json.data, meta: json.meta };
}

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

export async function getProductStock(idOrSlug: string): Promise<StockInfo> {
  return request<StockInfo>(`/products/${encodeURIComponent(idOrSlug)}/stock`, {
    cache: "no-store",
  });
}

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

export async function getOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
}

export async function createReturn(input: CreateReturnInput): Promise<Return> {
  return request<Return>("/returns", {
    method: "POST",
    body: input,
    cache: "no-store",
  });
}

// ---------------------------------------------------------------------------
// Back Office (admin)
//
// All back-office reads use `cache: "no-store"` — they power the admin agent,
// not the public storefront, so freshness matters more than throughput. None
// of these are linked from publicly cached pages.
// ---------------------------------------------------------------------------

export interface GetBackOfficeReturnsParams {
  /** ISO 8601 datetime or YYYY-MM-DD. Defaults to 30 days before `to`. */
  from?: string;
  /** ISO 8601 datetime or YYYY-MM-DD. Defaults to now. */
  to?: string;
  status?: BackOfficeReturnStatus;
  decision?: BackOfficeReturnDecision;
  /** 1–500, default 25. */
  limit?: number;
}

export async function getBackOfficeReturns(
  params: GetBackOfficeReturnsParams = {},
): Promise<{ data: Return[]; meta: BackOfficeDateRangeMeta }> {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.status) qs.set("status", params.status);
  if (params.decision) qs.set("decision", params.decision);
  if (params.limit) qs.set("limit", String(params.limit));

  const path = qs.toString()
    ? `/back-office/returns?${qs}`
    : "/back-office/returns";
  return requestWithMeta<Return[], BackOfficeDateRangeMeta>(path, {
    cache: "no-store",
  });
}

export interface GetBackOfficeSupportTicketsParams {
  /** ISO 8601 datetime or YYYY-MM-DD. Defaults to 30 days before `to`. */
  from?: string;
  /** ISO 8601 datetime or YYYY-MM-DD. Defaults to now. */
  to?: string;
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  category?: SupportTicketCategory;
  /** Staff username (e.g. `alex`). Unassigned tickets are excluded when set. */
  assignee?: string;
  /** 1–500, default 25. */
  limit?: number;
}

export async function getBackOfficeSupportTickets(
  params: GetBackOfficeSupportTicketsParams = {},
): Promise<{ data: SupportTicket[]; meta: BackOfficeDateRangeMeta }> {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.status) qs.set("status", params.status);
  if (params.priority) qs.set("priority", params.priority);
  if (params.category) qs.set("category", params.category);
  if (params.assignee) qs.set("assignee", params.assignee);
  if (params.limit) qs.set("limit", String(params.limit));

  const path = qs.toString()
    ? `/back-office/support-tickets?${qs}`
    : "/back-office/support-tickets";
  return requestWithMeta<SupportTicket[], BackOfficeDateRangeMeta>(path, {
    cache: "no-store",
  });
}

export interface GetBackOfficeStockParams {
  /** Restrict to specific product IDs. Joined as a comma-separated list. */
  productIds?: string[];
  /** When set, filters to (or excludes) products with 1–5 units in stock. */
  lowStock?: boolean;
  /** When set, filters to (or excludes) products with at least one unit. */
  inStock?: boolean;
  /** 1-based page number, default 1. */
  page?: number;
  /** 1–200, default 50. */
  limit?: number;
}

export async function getBackOfficeStock(
  params: GetBackOfficeStockParams = {},
): Promise<{ data: StockEntry[]; meta: BackOfficeStockMeta }> {
  const qs = new URLSearchParams();
  if (params.productIds && params.productIds.length > 0) {
    qs.set("productIds", params.productIds.join(","));
  }
  // Spec defines lowStock/inStock as a string enum of "true"|"false".
  if (params.lowStock !== undefined) {
    qs.set("lowStock", params.lowStock ? "true" : "false");
  }
  if (params.inStock !== undefined) {
    qs.set("inStock", params.inStock ? "true" : "false");
  }
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  const path = qs.toString()
    ? `/back-office/inventory/stock?${qs}`
    : "/back-office/inventory/stock";
  return requestWithMeta<StockEntry[], BackOfficeStockMeta>(path, {
    cache: "no-store",
  });
}

export interface GetBackOfficeSalesParams {
  /** ISO 8601 datetime or YYYY-MM-DD. Defaults to 30 days before `to`. */
  from?: string;
  /** ISO 8601 datetime or YYYY-MM-DD. Defaults to now. */
  to?: string;
  /** Restrict to a single product. 404 if it doesn't exist. */
  productId?: string;
}

export async function getBackOfficeSales(
  params: GetBackOfficeSalesParams = {},
): Promise<{ data: ProductSalesRow[]; meta: BackOfficeSalesMeta }> {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.productId) qs.set("productId", params.productId);

  const path = qs.toString()
    ? `/back-office/analytics/sales?${qs}`
    : "/back-office/analytics/sales";
  return requestWithMeta<ProductSalesRow[], BackOfficeSalesMeta>(path, {
    cache: "no-store",
  });
}
