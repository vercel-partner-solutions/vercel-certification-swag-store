import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AgentSidebar } from "@/components/agent-sidebar";
import { CartProvider } from "@/components/cart-provider";
import { CartSheet } from "@/components/cart-sheet";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "Vercel Swag Store";
const DEFAULT_DESCRIPTION =
  "Premium merchandise for developers who ship fast. High-quality apparel and accessories featuring the Vercel brand.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  generator: "v0.app",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
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
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
