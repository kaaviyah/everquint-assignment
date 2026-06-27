import type { Task } from "../types/task";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design Login Page",
    description: "Create login UI",
    status: "Backlog",
    priority: "High",
    dueDate: "2026-07-01",
  },
  {
    id: "2",
    title: "Build Navbar",
    description: "Responsive navbar",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2026-07-02",
  },
  {
    id: "3",
    title: "Deploy App",
    description: "Deploy to Vercel",
    status: "Done",
    priority: "Low",
    dueDate: "2026-07-03",
  },
];