import { useState } from "react";
import TaskCard from "../task/Task";
import type { Task } from "../../types/task";
import "./Column.css";

type ColumnProps = {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
};

function Column({ title, tasks, onEdit, onStatusChange }: ColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData("taskId");
    if (id) onStatusChange(id, title as Task["status"]);
  }

  return (
    <div
      className={`column ${dragOver ? "column-drag-over" : ""}`}
      data-testid={`column-${title.toLowerCase().replace(" ", "-")}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h4 className="column-title">{title}</h4>
        <span className="column-count">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="column-empty">No tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        ))
      )}
    </div>
  );
}

export default Column;
