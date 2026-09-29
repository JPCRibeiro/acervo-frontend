import * as React from "react";
import { NavItems } from "@/components/nav-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DraftingCompass } from "lucide-react";
import { useMe } from "@/features/user/api/queries";
import { NavUser } from "./nav-user";
import { OrgSwitcher } from "../features/organization/components/org-switcher";
import { NavConversations } from "./nav-conversations";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: me } = useMe();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! flex flex-row gap-2 font-normal select-none bg-transparent! cursor-default"
            >
                <DraftingCompass className="size-5!" />
                <span className="text-base">Acervo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <OrgSwitcher />
        <NavItems />
        <NavConversations />
      </SidebarContent>
      <SidebarFooter>{me && <NavUser user={me} />}</SidebarFooter>
    </Sidebar>
  );
}
