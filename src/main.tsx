import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { registerApiInterceptors } from "./lib/api/interceptors";
import ProtectedLayout from "./layouts/ProtectedLayout";
import LoginPage from "./app/(auth)/LoginPage";
import AppShell from "./layouts/AppShell";
import ChatPage from "./app/ChatPage";
import DocumentsPage from "./app/DocumentsPage";
import { TooltipProvider } from "./components/ui/tooltip";
import SourcePage from "./app/SourcePage";
import JoinPage from "./app/(auth)/JoinPage";
import RegisterPage from "./app/(auth)/RegisterPage";
import AuthLayout from "./layouts/AuthLayout";
import Workspace from "./app/WorkspacePage";

registerApiInterceptors();

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: "entrar", Component: LoginPage },
          { path: "cadastro", Component: RegisterPage },
          { path: "juntar", Component: JoinPage },
        ],
      },
      {
        Component: ProtectedLayout,
        children: [
          {
            Component: AppShell,
            children: [
              {
                index: true,
                Component: ChatPage,
                handle: {
                  title: "Assistente de Documentos",
                  subtitle: "Pergunte aos seus documentos",
                },
              },
              {
                path: "documentos",
                Component: DocumentsPage,
                handle: {
                  title: "Ingestão de documentos",
                  subtitle: "Carregue, indexe e monitore seus arquivos",
                },
              },
              {
                path: "fontes",
                Component: SourcePage,
                handle: {
                  title: "Fontes & citações",
                  subtitle: "Trechos que fundamentaram a última resposta",
                },
              },
              {
                path: "workspace",
                Component: Workspace,
                handle: {
                  title: "Configurações do workspace",
                  subtitle: "Convites e membros",
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
