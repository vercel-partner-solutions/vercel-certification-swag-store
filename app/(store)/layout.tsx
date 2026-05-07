import { AgentSidebar } from "@/components/agent-sidebar";
import { CartProvider } from "@/components/cart-provider";
import { CartSheet } from "@/components/cart-sheet";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CartProvider>
      <SidebarProvider
        defaultOpen={false}
        className="[--sidebar-width:28rem]!"
      >
        <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <AgentSidebar />
      </SidebarProvider>
      <CartSheet />
    </CartProvider>
  );
}
