import { useState, useEffect, useCallback } from "react";
import type { Task } from "../types/task";
import { loadTasks, saveTasks } from "../utils/storage";

type State = {
  tasks: Task[];
  migrated: boolean;
};

export function useTasks() {
  const [{ tasks, migrated }, setState] = useState<State>(() => {
    const result = loadTasks();
    return { tasks: result.tasks, migrated: result.migrated };
  });

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask(task: Task) {
    setState((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
  }

  function updateTask(updated: Task) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
  }

  function deleteTask(id: string) {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }

  const clearMigrated = useCallback(() => {
    setState((prev) => ({ ...prev, migrated: false }));
  }, []);

  return { tasks, migrated, addTask, updateTask, deleteTask, clearMigrated };
}
