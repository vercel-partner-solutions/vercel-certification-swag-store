export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";
export type ReturnStatus = "pending" | "approved" | "rejected" | "processed";
export type ReturnDecision = "approved" | "rejected" | null;

export const CATEGORY_SLUGS = [
  "bottles",
  "cups",
  "mugs",
  "desk",
  "stationery",
  "accessories",
  "bags",
  "hats",
  "t-shirts",
  "hoodies",
  "socks",
  "tech",
  "books",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: CategorySlug | string;
  images: string[];
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export interface StockInfo {
  productId: string;
  stock: number;
  inStock: boolean;
  lowStock: boolean;
}

export interface Category {
  slug: CategorySlug | string;
  name: string;
  productCount: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export interface CartItemWithProduct {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
  lineTotal: number;
}

export interface CartWithProducts {
  token: string;
  items: CartItemWithProduct[];
  totalItems: number;
  subtotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StoreConfig {
  storeName: string;
  currency: string;
  features: {
    wishlist: boolean;
    productComparison: boolean;
    reviews: boolean;
    liveChat: boolean;
    recentlyViewed: boolean;
  };
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  email: string;
  createdAt: string;
}

export interface Return {
  id: string;
  orderId: string;
  callback: string | null;
  items: { productId: string; quantity: number }[];
  reason: string;
  status: "pending" | "approved" | "rejected" | "processed";
  scheduledFireAt: string;
  decision: "approved" | "rejected" | null;
  refundAmount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
  order?: {
    id: string;
    total: number;
    status: string;
  };
}
