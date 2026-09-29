import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth";
import {
  useCreateOrganization,
  useJoinOrganization,
} from "@/features/organization/api/queries";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function CreateOrgDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const create = useCreateOrganization();
  const switchOrg = useAuthStore((s) => s.switchOrganization);
  const navigate = useNavigate();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const org = await create.mutateAsync(name.trim());
      await switchOrg(org.id);
      onOpenChange(false);
      setName("");
      navigate("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Erro ao criar organização",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar organização</DialogTitle>
          <DialogDescription>
            Você será o dono da nova organização.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Nome</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={create.isPending || !name.trim()}>
              {create.isPending && <Loader2 className="animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function JoinOrgDialog({ open, onOpenChange }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const join = useJoinOrganization();
  const switchOrg = useAuthStore((s) => s.switchOrganization);
  const navigate = useNavigate();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const org = await join.mutateAsync(code.trim());
      await switchOrg(org.id);
      onOpenChange(false);
      setCode("");
      navigate("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Erro ao entrar na organização",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrar com convite</DialogTitle>
          <DialogDescription>
            Use um código de convite para entrar em uma organização.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Código de convite</Label>
            <Input
              id="invite-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              className="font-mono"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={join.isPending || !code.trim()}>
              {join.isPending && <Loader2 className="animate-spin" />}
              Entrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
