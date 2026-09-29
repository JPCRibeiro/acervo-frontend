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
import { DraftingCompass, VectorPolygon } from "lucide-react";
import { NavLink } from "react-router";
import { useMe } from "@/features/user/api/queries";
import { NavUser } from "./nav-user";
import { OrgSwitcher } from "../features/organization/components/org-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: me } = useMe();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="data-[slot=sidebar-menu-item]:p-1.5! flex flex-row gap-2 font-medium select-none">
            <DraftingCompass />
            Acervo
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <OrgSwitcher />
        <NavItems />
      </SidebarContent>
      <SidebarFooter>{me && <NavUser user={me} />}</SidebarFooter>
    </Sidebar>
  );
}
