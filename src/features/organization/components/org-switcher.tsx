import { Building2, Check, ChevronsUpDown, KeyRound, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useOrganizations } from "@/features/organization/api/queries";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { CreateOrgDialog, JoinOrgDialog } from "./org-dialogs";

export function OrgSwitcher() {
  const { data: orgs } = useOrganizations();
  const currentOrgId = useAuthStore((s) => s.organizationId);
  const switchOrganization = useAuthStore((s) => s.switchOrganization);
  const [dialog, setDialog] = useState<'create' | 'join' | null>(null);

  const active = orgs?.find((o) => o.id === currentOrgId);

  const handleSwitch = async (id: string) => {
    if (id === currentOrgId) return;
    try {
      await switchOrganization(id);
    } catch {}
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-background"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {active?.name ?? "Selecione"}
                    </span>
                    <span className="truncate text-xs">{active?.role}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Organizações
                </DropdownMenuLabel>
                {orgs?.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleSwitch(org.id)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <Building2 className="size-3.5 shrink-0" />
                    </div>
                    <span className="flex-1 truncate">{org.name}</span>
                    {org.id === currentOrgId && (
                      <Check className="size-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setDialog('create')} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <span className="font-medium text-muted-foreground">Criar organização</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDialog('join')} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <KeyRound className="size-4" />
                  </div>
                  <span className="font-medium text-muted-foreground">Entrar com convite</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <CreateOrgDialog open={dialog === 'create'} onOpenChange={(v) => setDialog(v ? 'create' : null)} />
      <JoinOrgDialog open={dialog === 'join'} onOpenChange={(v) => setDialog(v ? 'join' : null)} />
    </SidebarGroup>
  );
}
