import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { useMatches } from "react-router";

type PageHandle = { title?: string; subtitle?: string };

function usePageMeta(): PageHandle {
  const matches = useMatches();
  for (let i = matches.length - 1; i >= 0; i--) {
    const h = matches[i].handle as PageHandle | undefined;
    if (h?.title) return h;
  }
  return { title: '', subtitle: '' };
}

export function SiteHeader() {
  const { title, subtitle } = usePageMeta();
  
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-border">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4 my-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="flex flex-col">
              <BreadcrumbPage>{title}</BreadcrumbPage>
              <BreadcrumbPage className="text-muted-foreground text-xs">{subtitle}</BreadcrumbPage>
            </div>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}