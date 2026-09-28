import { Navigate, Outlet } from "react-router";
import { DraftingCompass, Lock, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function AuthLayout() {
  const status = useAuthStore((s) => s.status);
  if (status === "authenticated") return <Navigate to="/" replace />;

  return (
    <main className="relative min-h-svh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-svh">
        <section className="flex flex-1 flex-col px-5">
          <div className="flex flex-row gap-2 px-8 py-6 font-medium">
            <DraftingCompass />
            Acervo
          </div>
          <div className="w-full max-w-sm flex flex-col mx-auto h-full">
            <div className="flex flex-col my-auto">
              <Outlet />
            </div>
          </div>
        </section>

        <aside className="hidden basis-3/5 flex-col items-center justify-center border-l border-border px-8 xl:flex">
          <div className="flex max-w-lg flex-col gap-4 text-center">
            <h2 className="text-4xl font-bold">
              Respostas confiáveis a partir dos seus documentos.
            </h2>
            <p className="text-muted-foreground">
              RAG multi-organização para análise segura de contratos, políticas
              e relatórios - cada resposta fundamentada nos seus próprios
              arquivos.
            </p>
            <div className="flex flex-col gap-4 items-center">
              <p className="items-center flex gap-4">
                <ShieldCheck />
                Seus dados nunca são usados para treinar modelos
              </p>
              <p className="items-center flex gap-4">
                <Lock />
                Isolamento total por organização
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
