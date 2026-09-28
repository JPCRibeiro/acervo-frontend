import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth';
import { useOrganizations } from '../api/queries';

export default function OrgSwitcher() {
  const { data: orgs, isLoading } = useOrganizations();
  const currentOrgId = useAuthStore((s) => s.organizationId);
  const switchOrganization = useAuthStore((s) => s.switchOrganization);

  const current = orgs?.find((o) => o.id === currentOrgId);

  const handleSwitch = async (id: string) => {
    if (id === currentOrgId) return;
    try {
      await switchOrganization(id);
    } catch {
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 text-sm hover:bg-muted">
        <span className="flex min-w-0 items-center gap-2">
          <Building2 size={16} className="shrink-0 text-muted-foreground" />
          <span className="truncate">
            {isLoading ? 'Carregando…' : current?.name ?? 'Selecione'}
          </span>
        </span>
        <ChevronsUpDown size={16} className="shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>Organizações</DropdownMenuLabel>
        {orgs?.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate">{org.name}</span>
              <span className="text-xs text-muted-foreground">{org.role}</span>
            </span>
            {org.id === currentOrgId && <Check size={16} className="shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}