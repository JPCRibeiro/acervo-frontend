import { useAuthStore } from "@/store/auth";

export default function ChatPage() {
  const org = useAuthStore((s) => s.organizationId);
  const role = useAuthStore((s) => s.role);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <p className="text-sm text-muted-foreground">
        Org ativa: <span className="font-mono">{org}</span>
      </p>
      <p className="text-sm text-muted-foreground">Papel: {role}</p>
    </div>
  );
}
