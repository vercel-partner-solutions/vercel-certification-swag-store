"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AgentSidebar() {
  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarHeader>
        <div className="px-2 py-1.5 text-sm font-semibold">
          Shopping Assistant
        </div>
      </SidebarHeader>
      <SidebarContent />
    </Sidebar>
  );
}
