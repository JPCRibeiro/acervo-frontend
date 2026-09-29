import { useState } from 'react';
import { Check, Copy, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { useOrganizations } from '@/features/organization/api/queries';
import { useInviteCode, useMembers } from '@/features/workspace/api/queries';

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

export default function WorkspacePage() {
  const role = useAuthStore((s) => s.role);
  const currentOrgId = useAuthStore((s) => s.organizationId);
  const { data: orgs } = useOrganizations();
  const currentOrg = orgs?.find((o) => o.id === currentOrgId);

  const isOwner = role === 'OWNER';
  const { data: members, isLoading: loadingMembers } = useMembers();
  const { data: invite } = useInviteCode(isOwner);

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
      <section className="rounded-xl border border-border p-4">
        <h2 className="text-sm font-medium">Organização</h2>
        <p className="mt-1 text-lg font-semibold">{currentOrg?.name ?? '—'}</p>
      </section>

      {isOwner && (
        <section className="rounded-xl border border-border p-4">
          <h2 className="text-sm font-medium">Código de convite</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compartilhe este código para convidar pessoas para a organização.
          </p>
          <div className="mt-3 flex gap-2">
            <Input readOnly value={invite?.inviteCode ?? ''} className="font-mono" />
            <Button type="button" variant="outline" onClick={copy} disabled={!invite}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          Membros{members ? ` · ${members.length}` : ''}
        </div>

        {loadingMembers ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Carregando…
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {members?.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {initials(m.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Mail className="size-3" /> {m.email}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    m.role === 'OWNER' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {m.role === 'OWNER' ? 'Dono' : 'Membro'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}