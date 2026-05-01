"use client"

import { Bot } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function AgentButton() {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar()
  const isOpen = isMobile ? openMobile : open

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle agent panel"
      aria-expanded={isOpen}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      <Bot className="h-5 w-5" />
    </button>
  )
}
