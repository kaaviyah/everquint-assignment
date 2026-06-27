import Column from "../board/Column";
import "./Board.css";
import { mockTasks } from "../../utils/mockTasks";

function Board() {
  return (
    <div>
      <h4>Team WorkFlow Board</h4>

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
    </div>
  );
}

export default Board;