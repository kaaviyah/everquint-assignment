import { useState, useEffect } from "react";
import type { Task, TaskStatus, TaskPriority } from "../types/task";

export type SortField = "createdAt" | "updatedAt" | "priority";
export type SortOrder = "asc" | "desc";

export type Filters = {
  search: string;
  statuses: TaskStatus[];
  priority: TaskPriority | "All";
  sortField: SortField;
  sortOrder: SortOrder;
};

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};

function readFromURL(): Filters {
  const p = new URLSearchParams(window.location.search);
  return {
    search: p.get("q") ?? "",
    statuses: (p.get("status")?.split(",").filter(Boolean) as TaskStatus[]) ?? [],
    priority: (p.get("priority") as TaskPriority | "All") ?? "All",
    sortField: (p.get("sort") as SortField) ?? "updatedAt",
    sortOrder: (p.get("order") as SortOrder) ?? "desc",
  };
}

function writeToURL(filters: Filters) {
  const p = new URLSearchParams();
  if (filters.search) p.set("q", filters.search);
  if (filters.statuses.length) p.set("status", filters.statuses.join(","));
  if (filters.priority !== "All") p.set("priority", filters.priority);
  if (filters.sortField !== "updatedAt") p.set("sort", filters.sortField);
  if (filters.sortOrder !== "desc") p.set("order", filters.sortOrder);
  const qs = p.toString();
  window.history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
}

export function useFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<Filters>(readFromURL);

  useEffect(() => {
    writeToURL(filters);
  }, [filters]);

  function applyFilters(updates: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...updates }));
  }

  const filtered = tasks
    .filter((t) => {
      if (filters.statuses.length && !filters.statuses.includes(t.status)) return false;
      if (filters.priority !== "All" && t.priority !== filters.priority) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (filters.sortField === "priority") {
        cmp = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      } else {
        cmp = new Date(a[filters.sortField]).getTime() - new Date(b[filters.sortField]).getTime();
      }
      return filters.sortOrder === "asc" ? cmp : -cmp;
    });

  return { filters, applyFilters, filtered };
}
