import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
