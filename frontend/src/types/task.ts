export interface Task {
  id: string;
  title: string;
  description: string;
  status: "Backlog" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}