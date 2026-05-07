import type { Metadata } from "next";
import Link from "next/link";
import { Bot } from "lucide-react";
import { logoutAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { AdminAgentChat } from "@/components/admin-agent-chat";

export const metadata: Metadata = {
  title: "Store Admin Agent",
};

export default function AdminPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Bot className="h-5 w-5" aria-hidden="true" />
            <span>Store Admin Agent</span>
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 py-4">
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card">
          <AdminAgentChat />
        </div>
      </div>
    </div>
  );
}
