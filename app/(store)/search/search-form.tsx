"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Form from "next/form"
import { Loader2, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/lib/types"

interface SearchFormProps {
  initialQuery: string
  initialCategory: string
  categories: Category[]
}

const ALL_VALUE = "__all__"
const AUTO_TRIGGER_MIN = 3
const DEBOUNCE_MS = 300

function buildHref(query: string, category: string) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (category) params.set("category", category)
  const qs = params.toString()
  return qs ? `/search?${qs}` : "/search"
}

export function SearchForm({
  initialQuery,
  initialCategory,
  categories,
}: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [isPending, startTransition] = useTransition()

  // Stay in sync if the URL changes via Back/Forward.
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])
  useEffect(() => {
    setCategory(initialCategory)
  }, [initialCategory])

  // Auto-search after >= 3 chars (or when cleared), debounced.
  useEffect(() => {
    if (query === initialQuery) return
    if (query.length > 0 && query.length < AUTO_TRIGGER_MIN) return
    const t = setTimeout(() => {
      startTransition(() => {
        router.replace(buildHref(query, category), { scroll: false })
      })
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query, category, initialQuery, router])

  const handleCategoryChange = (next: string) => {
    const value = next === ALL_VALUE ? "" : next
    setCategory(value)
    startTransition(() => {
      router.replace(buildHref(query, value), { scroll: false })
    })
  }

  const handleClear = () => {
    setQuery("")
    startTransition(() => {
      router.replace(buildHref("", category), { scroll: false })
    })
  }

  return (
    <Form
      action="/search"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          name="q"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {isPending ? (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-label="Searching"
          />
        ) : (
          query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )
        )}
        {category && <input type="hidden" name="category" value={category} />}
      </div>

      <Select
        value={category || ALL_VALUE}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.slug} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Form>
  )
}
