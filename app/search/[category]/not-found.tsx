import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Category Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        The category you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild className="mt-6">
        <Link href="/search">Browse All Products</Link>
      </Button>
    </div>
  )
}
