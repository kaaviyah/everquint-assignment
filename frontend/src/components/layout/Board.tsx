import { useState, useEffect, useCallback } from "react";
import Column from "../board/Column";
import FilterBar from "../board/FilterBar";
import Button from "../ui/Button";
import Modal from "../ui/Modal/Modal";
import Toast from "../ui/Toast/Toast";
import TaskForm from "../task/TaskForm";
import type { TaskFormValues } from "../task/TaskForm/TaskForm";
import { useTasks } from "../../hooks/useTasks";
import { useFilters } from "../../hooks/useFilters";
import { useToast } from "../../hooks/useToast";
import type { Task } from "../../types/task";
import "./Board.css";

function Board() {
  const { tasks, addTask, updateTask, deleteTask, migrated, clearMigrated } =
    useTasks();
  const { filters, applyFilters, filtered } = useFilters(tasks);
  const { toasts, addToast, dismissToast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (migrated) {
      addToast("Tasks updated from an older data format", "warning");
      clearMigrated();
    }
  }, [migrated, addToast, clearMigrated]);

  function handleCreate(values: TaskFormValues) {
    const now = new Date().toISOString();
    addTask({
      id: `${Date.now()}`,
      ...values,
      createdAt: now,
      updatedAt: now,
    });
    setCreateOpen(false);
    addToast("Task created", "success");
  }

  function handleUpdate(values: TaskFormValues) {
    if (!editingTask) return;
    updateTask({
      ...editingTask,
      ...values,
      updatedAt: new Date().toISOString(),
    });
    setEditingTask(null);
    addToast("Task saved", "success");
  }

  function handleDelete(id: string) {
    deleteTask(id);
    setEditingTask(null);
    addToast("Task deleted");
  }

  const handleStatusChange = useCallback(
    (id: string, status: Task["status"]) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      updateTask({ ...task, status, updatedAt: new Date().toISOString() });
    },
    [tasks, updateTask]
  );

  const hasActiveTasks = tasks.length > 0;
  const filtersHideAll = hasActiveTasks && filtered.length === 0;

  return (
    <div className="board-container">
      <div className="board-header">
        <h1 className="board-heading">Team Workflow</h1>
        <Button onClick={() => setCreateOpen(true)}>+ New task</Button>
      </div>

      <FilterBar filters={filters} onChange={applyFilters} />

      {!hasActiveTasks && (
        <div className="empty-state">
          <p>No tasks yet.</p>
          <button className="empty-cta" onClick={() => setCreateOpen(true)}>
            Create your first task
          </button>
        </div>
      )}

      {filtersHideAll && (
        <div className="empty-state">
          <p>No tasks match the current filters.</p>
          <button
            className="empty-cta"
            onClick={() =>
              applyFilters({ search: "", statuses: [], priority: "All" })
            }
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="board">
        {(["Backlog", "In Progress", "Done"] as Task["status"][]).map((status) => (
          <Column
            key={status}
            title={status}
            tasks={filtered.filter((t) => t.status === status)}
            onEdit={setEditingTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New task"
      >
        <TaskForm
          onSave={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {editingTask && (
        <Modal isOpen onClose={() => setEditingTask(null)} title="Edit task">
          <TaskForm
            initial={editingTask}
            onSave={handleUpdate}
            onCancel={() => setEditingTask(null)}
            onDelete={() => handleDelete(editingTask.id)}
          />
        </Modal>
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default Board;
