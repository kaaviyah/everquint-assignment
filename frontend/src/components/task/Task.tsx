import "./Task.css";
import type { Task } from "../../types/task";

type TaskCardProps = {
  task: Task;
};

function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <div className="task-footer">
        <span>{task.priority}</span>
        <span>{task.dueDate}</span>
      </div>
    </div>
  );
}

export default TaskCard;