import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Clothing Category - Dark, bold design */}
        <Link
          href="/search/apparel"
          className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl bg-foreground p-8"
        >
          <div className="absolute inset-0">
            <Image
              src="/categories/clothing.jpg"
              alt="Clothing collection"
              fill
              className="object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="relative z-10">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80 backdrop-blur-sm">
              Collection
            </span>
            <h3 className="mt-3 text-3xl font-bold text-white">Clothing</h3>
            <p className="mt-2 max-w-xs text-sm text-white/70">
              Premium tees, hoodies, and more. Built for developers who ship.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-all group-hover:gap-3">
              Shop Apparel
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Drinkware Category - Light, minimal design */}
        <Link
          href="/search/drinkware"
          className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-muted p-8"
        >
          <div className="absolute inset-0">
            <Image
              src="/categories/drinkware.jpg"
              alt="Drinkware collection"
              fill
              className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent" />
          
          <div className="relative z-10">
            <span className="inline-block rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground/70">
              Essentials
            </span>
            <h3 className="mt-3 text-3xl font-bold text-foreground">Drinkware</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Mugs and bottles to fuel your coding sessions.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-all group-hover:gap-3">
              Shop Drinkware
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
