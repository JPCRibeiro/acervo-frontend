import { useEffect } from "react";
import { Outlet } from "react-router";
import { Loader2 } from 'lucide-react';
import { useAuthStore } from "./store/auth";

export default function App() {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (status === 'loading') {
    return (
      <main className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </main>
    );
  }
  return <Outlet />;
}