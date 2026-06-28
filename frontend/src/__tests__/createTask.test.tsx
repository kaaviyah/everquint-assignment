import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("task creation", () => {
  it("creates a task and shows it in the Backlog column", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();

    // Open the create modal
    await user.click(screen.getByRole("button", { name: /new task/i }));

    // Modal should be visible now
    const titleInput = await screen.findByLabelText("Title");
    await user.type(titleInput, "Fix login redirect bug");

    await user.click(screen.getByRole("button", { name: /create task/i }));

    // Task appears in the Backlog column (default status)
    const backlogCol = screen.getByTestId("column-backlog");
    expect(within(backlogCol).getByText("Fix login redirect bug")).toBeInTheDocument();
  });

  it("shows a validation error when title is empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /new task/i }));
    await user.click(screen.getByRole("button", { name: /create task/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
  });

  it("persists tasks across remounts (simulates a page refresh)", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: /new task/i }));
    const titleInput = await screen.findByLabelText("Title");
    await user.type(titleInput, "Persistent task");
    await user.click(screen.getByRole("button", { name: /create task/i }));

    // Verify it appeared
    expect(screen.getByText("Persistent task")).toBeInTheDocument();

    // Simulate refresh
    unmount();
    render(<App />);

    expect(screen.getByText("Persistent task")).toBeInTheDocument();
  });
});
