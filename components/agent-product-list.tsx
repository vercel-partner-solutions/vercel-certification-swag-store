"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { SearchProductsToolInvocation } from "@/lib/agent";

interface AgentProductListProps {
  invocation: SearchProductsToolInvocation;
}

export function AgentProductList({ invocation }: AgentProductListProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    const query = invocation.input?.query;
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Searching{query ? ` for "${query}"` : ""}…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if (!output) return null;

  if ("error" in output && output.error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  if (output.count === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <ul className="divide-y divide-border">
        {output.products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center gap-3 p-3 transition-colors hover:bg-secondary/50"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(product.price, product.currency)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
