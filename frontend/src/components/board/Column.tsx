import TaskCard from "../task/Task";
import type { Task } from "../../types/task";
import "./Column.css";
type Props = {
  title: string;
  tasks : Task[];
};

function Column({ title,tasks }: Props) {
  return (
    <div className="column">
      <h4>{title}</h4>
      {tasks?.length === 0 ? (
  <p className="empty">No tasks</p>
) : (
  tasks?.map((task) => (
    <TaskCard key={task.id} task={task} />
  ))
)}
    </div>
  );
}

export default Column;