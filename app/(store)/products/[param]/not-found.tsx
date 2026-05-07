import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Product Not Found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Link>
        </Button>
      </div>
    </main>
  );
}
