import Card from "../ui/Card";
import type { Task } from "../../types/task";
import "./Task.css";

type TaskCardProps = {
  task: Task;
};

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="task-card">
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <div className="task-footer">
        <span>{task.priority}</span>
        <span>{task.dueDate}</span>
      </div>
    </Card>
  );
}

export default TaskCard;