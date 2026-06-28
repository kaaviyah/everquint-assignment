import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import App from "../App";
import type { Task } from "../types/task";
import { SCHEMA_VERSION } from "../utils/storage";

function seedTasks(tasks: Task[]) {
  localStorage.setItem(
    "workflow_tasks",
    JSON.stringify({ version: SCHEMA_VERSION, tasks })
  );
}

const now = new Date().toISOString();

const BASE: Omit<Task, "id" | "title" | "priority" | "status"> = {
  description: "",
  assignee: "",
  tags: [],
  createdAt: now,
  updatedAt: now,
};

describe("filtering and sorting", () => {
  beforeEach(() => {
    seedTasks([
      { ...BASE, id: "1", title: "High priority task", priority: "High", status: "Backlog" },
      { ...BASE, id: "2", title: "Medium priority task", priority: "Medium", status: "In Progress" },
      { ...BASE, id: "3", title: "Low priority task", priority: "Low", status: "Done" },
    ]);
  });

  it("filters by priority, showing only matching tasks", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("High priority task")).toBeInTheDocument();
    expect(screen.getByText("Medium priority task")).toBeInTheDocument();
    expect(screen.getByText("Low priority task")).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: /filter by priority/i }),
      "High"
    );

    expect(screen.getByText("High priority task")).toBeInTheDocument();
    expect(screen.queryByText("Medium priority task")).not.toBeInTheDocument();
    expect(screen.queryByText("Low priority task")).not.toBeInTheDocument();
  });

  it("filters by text search in title", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("searchbox"), "high");

    expect(screen.getByText("High priority task")).toBeInTheDocument();
    expect(screen.queryByText("Medium priority task")).not.toBeInTheDocument();
  });

  it("shows empty-filters message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("searchbox"), "zzz-no-match");

    expect(
      screen.getByText(/no tasks match the current filters/i)
    ).toBeInTheDocument();
  });
});

describe("status change", () => {
  beforeEach(() => {
    seedTasks([
      {
        ...BASE,
        id: "10",
        title: "Move me to done",
        priority: "Medium",
        status: "Backlog",
      },
    ]);
  });

  it("moves a task between columns via the inline status select", async () => {
    const user = userEvent.setup();
    render(<App />);

    const backlogCol = screen.getByTestId("column-backlog");
    const doneCol = screen.getByTestId("column-done");

    // Task starts in Backlog
    expect(within(backlogCol).getByText("Move me to done")).toBeInTheDocument();

    // Change status to Done via the inline select on the card
    const statusSelect = within(backlogCol).getByRole("combobox", {
      name: /change task status/i,
    });
    await user.selectOptions(statusSelect, "Done");

    // Task should now be in Done column
    expect(within(doneCol).getByText("Move me to done")).toBeInTheDocument();
    expect(
      within(backlogCol).queryByText("Move me to done")
    ).not.toBeInTheDocument();
  });
});
