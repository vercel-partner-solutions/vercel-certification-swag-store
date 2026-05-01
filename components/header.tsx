import Link from "next/link";
import { Search } from "lucide-react";
import { AgentButton } from "@/components/agent-button";
import { CartButton } from "@/components/cart-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-5 w-5"
            viewBox="0 0 76 65"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span className="font-semibold">Vercel Swag Store</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/search"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </Link>
          <CartButton />
          <AgentButton />
        </nav>
      </div>
    </header>
  );
}
