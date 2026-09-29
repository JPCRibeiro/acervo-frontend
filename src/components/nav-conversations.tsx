import { useMemo } from "react";
import { NavLink, useParams } from "react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/features/chat/api/queries";
import type { ConversationSummary } from "@/types";

const DAY = 86_400_000;

type Bucket = { label: string; items: ConversationSummary[] };

function groupByRecency(conversations: ConversationSummary[]): Bucket[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - DAY;
  const startOf7d = startOfToday - 6 * DAY;

  const hoje: ConversationSummary[] = [];
  const ontem: ConversationSummary[] = [];
  const semana: ConversationSummary[] = [];
  const anterior: ConversationSummary[] = [];

  for (const c of conversations) {
    const t = new Date(c.updatedAt).getTime();
    if (t >= startOfToday) hoje.push(c);
    else if (t >= startOfYesterday) ontem.push(c);
    else if (t >= startOf7d) semana.push(c);
    else anterior.push(c);
  }

  return [
    { label: "Hoje", items: hoje },
    { label: "Ontem", items: ontem },
    { label: "Últimos 7 dias", items: semana },
    { label: "Anterior", items: anterior },
  ].filter((b) => b.items.length > 0);
}

export function NavConversations() {
  const { id: activeId } = useParams();
  const { data, isLoading } = useConversations();

  const buckets = useMemo(() => groupByRecency(data ?? []), [data]);

  return (
    <>
      {isLoading ? (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent className="flex flex-col gap-2 px-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </SidebarGroupContent>
        </SidebarGroup>
      ) : (
        buckets.map((bucket) => (
          <SidebarGroup key={bucket.label} className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>{bucket.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {bucket.items.map((c) => (
                  <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton asChild isActive={c.id === activeId} tooltip={c.title} className="font-normal!">
                      <NavLink to={`/c/${c.id}`}>
                        <span className="truncate">{c.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))
      )}
    </>
  );
}