import type { Task } from "../types/task";

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86_400_000).toISOString();
const twoDaysAgo = new Date(Date.now() - 172_800_000).toISOString();

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design login page",
    description:
      "Create the login UI — needs to match the new brand guidelines. Handle email/password and OAuth button.",
    status: "Backlog",
    priority: "High",
    assignee: "Sarah K.",
    tags: ["design", "auth"],
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: "2",
    title: "Build responsive navbar",
    description:
      "Navbar collapses to hamburger on mobile. Dropdown for user account menu.",
    status: "In Progress",
    priority: "Medium",
    assignee: "Tom R.",
    tags: ["frontend"],
    createdAt: yesterday,
    updatedAt: now,
  },
  {
    id: "3",
    title: "Deploy to Vercel",
    description:
      "Set up CI/CD and deploy. Configure env vars for production — don't forget the API key.",
    status: "Done",
    priority: "Low",
    assignee: "",
    tags: ["devops"],
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
  },
];
