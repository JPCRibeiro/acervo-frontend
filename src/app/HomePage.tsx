import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const userId = useAuthStore((s) => s.userId);
  const organizationId = useAuthStore((s) => s.organizationId);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <div className="text-center text-xs">
        <p className="mb-2 text-sm text-muted-foreground">Autenticado ✓</p>
        <p className="font-mono">user: {userId}</p>
        <p className="font-mono">org: {organizationId}</p>
        <p className="font-mono">role: {role}</p>
      </div>
      <Button variant="outline" onClick={() => logout()}>Sair</Button>
    </main>
  );
}