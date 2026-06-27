import { useState } from "react";
import Column from "../board/Column";
import Button from "../ui/Button";
import Modal from "../ui/Modal/Modal";
import "./Board.css";
import { mockTasks } from "../../utils/mockTasks";
import type { Task } from "../../types/task";
import TaskForm from "../task/TaskForm";

function Board() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  const handleAddTask = (task: {
  title: string;
  description: string;
  status: string;
}) => {
  const newTask: Task = {
    id: Date.now().toString(),
    title: task.title,
    description: task.description,
    status: task.status as Task["status"],
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0],
  };

  setTasks((prev) => [...prev, newTask]);
  setIsModalOpen(false);
};

  return (
    <div className="board-container">
      <div className="board-header">
        <h1>Team Workflow Board</h1>

        <Button onClick={() => setIsModalOpen(true)}>
          + Add Task
        </Button>
      </div>

      <div className="board">
        <Column
          title="Backlog"
          tasks={mockTasks.filter((t) => t.status === "Backlog")}
        />

        <Column
          title="In Progress"
          tasks={mockTasks.filter((t) => t.status === "In Progress")}
        />

        <Column
          title="Done"
          tasks={mockTasks.filter((t) => t.status === "Done")}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2>Create Task</h2>
         <TaskForm onAdd={handleAddTask} />
      </Modal>
    </div>
  );
}

export default Board;