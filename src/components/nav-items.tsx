import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Cog, Files, Quote, SquarePen } from "lucide-react";
import { NavLink, useMatch } from "react-router";

type NavItemData = { label: string; url: string; icon?: React.ReactNode };

const navItems = [
  { label: "Novo Chat", url: "/", icon: <SquarePen /> },
  { label: "Documentos", url: "/documentos", icon: <Files /> },
  { label: "Fontes & Citações", url: "/fontes", icon: <Quote /> },
  { label: "Configurações", url: "/workspace", icon: <Cog /> },
];

function NavItem({ label, url, icon }: NavItemData) {
  const match = useMatch({ path: url, end: url === '/' });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={!!match} tooltip={label}>
        <NavLink to={url} end={url === '/'}>
          {icon}
          <span className="font-normal">{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavItems() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}