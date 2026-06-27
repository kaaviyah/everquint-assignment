import Badge from "../ui/Badge";
import Card from "../ui/Card";
import type { Task } from "../../types/task";
import { relativeTime } from "../../utils/relativeTime";
import "./Task.css";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
};

function TaskCard({ task, onEdit, onStatusChange }: TaskCardProps) {
  return (
    <Card
      className="task-card"
      onClick={() => onEdit(task)}
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="task-card-header">
        <Badge variant={task.priority.toLowerCase() as "low" | "medium" | "high"}>
          {task.priority}
        </Badge>
        <select
          className="inline-status-select"
          value={task.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(task.id, e.target.value as Task["status"]);
          }}
          aria-label="Change task status"
        >
          <option value="Backlog">Backlog</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <p className="task-title">{task.title}</p>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="task-footer">
        <span className="task-assignee">
          {task.assignee || <span className="unassigned">Unassigned</span>}
        </span>
        <time
          className="task-time"
          dateTime={task.updatedAt}
          title={new Date(task.updatedAt).toLocaleString()}
        >
          {relativeTime(task.updatedAt)}
        </time>
      </div>
    </Card>
  );
}

export default TaskCard;
