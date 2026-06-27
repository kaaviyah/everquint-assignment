import type { Task } from "../types/task";

const STORAGE_KEY = "workflow_tasks";
export const SCHEMA_VERSION = 2;

type StoredData = {
  version: number;
  tasks: Task[];
};

type LegacyTask = Record<string, unknown>;

function migrateToV2(raw: LegacyTask[]): Task[] {
  const now = new Date().toISOString();
  return raw.map((t) => ({
    id: String(t.id ?? Date.now()),
    title: String(t.title ?? ""),
    description: String(t.description ?? ""),
    status: (t.status as Task["status"]) ?? "Backlog",
    priority: (t.priority as Task["priority"]) ?? "Medium",
    assignee: "",
    tags: [],
    createdAt: String(t.createdAt ?? now),
    updatedAt: String(t.updatedAt ?? now),
  }));
}

export type LoadResult = {
  tasks: Task[];
  migrated: boolean;
};

export function loadTasks(): LoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [], migrated: false };

    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return { tasks: migrateToV2(parsed as LegacyTask[]), migrated: true };
    }

    const data = parsed as StoredData;
    if (!data.version || data.version < SCHEMA_VERSION) {
      return { tasks: migrateToV2((data.tasks ?? []) as unknown as LegacyTask[]), migrated: true };
    }

    return { tasks: Array.isArray(data.tasks) ? data.tasks : [], migrated: false };
  } catch {
    return { tasks: [], migrated: false };
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, tasks }));
  } catch (e) {
    console.warn("Could not save tasks", e);
  }
}
