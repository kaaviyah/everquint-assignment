import { useState, useRef } from "react";
import TextInput from "../../ui/TextInput";
import TextArea from "../../ui/TextArea";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import type { Task } from "../../../types/task";
import "./TaskForm.css";

export type TaskFormValues = {
  title: string;
  description: string;
  status: Task["status"];
  priority: Task["priority"];
  assignee: string;
  tags: string[];
};

type TaskFormProps = {
  initial?: Task;
  onSave: (values: TaskFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

type Errors = Partial<Record<"title", string>>;

function TaskForm({ initial, onSave, onCancel, onDelete }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<Task["status"]>(initial?.status ?? "Backlog");
  const [priority, setPriority] = useState<Task["priority"]>(initial?.priority ?? "Medium");
  const [assignee, setAssignee] = useState(initial?.assignee ?? "");
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(", ") ?? "");
  const [errors, setErrors] = useState<Errors>({});

  const isDirty = useRef(false);

  function validate(): boolean {
    const errs: Errors = {};
    if (!title.trim()) {
      errs.title = "Title is required";
    } else if (title.trim().length > 120) {
      errs.title = "Title must be 120 characters or fewer";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: assignee.trim(),
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  function handleCancel() {
    if (isDirty.current && !window.confirm("You have unsaved changes. Discard them?")) {
      return;
    }
    onCancel();
  }

  function handleDelete() {
    if (!onDelete) return;
    if (window.confirm("Delete this task? This can't be undone.")) {
      onDelete();
    }
  }

  const isEditing = !!initial;

  return (
    <div className="task-form">
      <div className="field">
        <TextInput
          label="Title"
          name="title"
          value={title}
          placeholder="Short task title"
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors({});
            isDirty.current = true;
          }}
        />
        {errors.title && (
          <span className="error-message" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <TextArea
        label="Description"
        name="description"
        value={description}
        placeholder="What needs to be done?"
        rows={3}
        onChange={(e) => {
          setDescription(e.target.value);
          isDirty.current = true;
        }}
      />

      <div className="form-row">
        <Select
          label="Status"
          name="status"
          value={status}
          options={[
            { label: "Backlog", value: "Backlog" },
            { label: "In Progress", value: "In Progress" },
            { label: "Done", value: "Done" },
          ]}
          onChange={(e) => {
            setStatus(e.target.value as Task["status"]);
            isDirty.current = true;
          }}
        />
        <Select
          label="Priority"
          name="priority"
          value={priority}
          options={[
            { label: "Low", value: "Low" },
            { label: "Medium", value: "Medium" },
            { label: "High", value: "High" },
          ]}
          onChange={(e) => {
            setPriority(e.target.value as Task["priority"]);
            isDirty.current = true;
          }}
        />
      </div>

      <TextInput
        label="Assignee"
        name="assignee"
        value={assignee}
        placeholder="Who's responsible?"
        onChange={(e) => {
          setAssignee(e.target.value);
          isDirty.current = true;
        }}
      />

      <TextInput
        label="Tags"
        name="tags"
        value={tagsInput}
        placeholder="design, bug, frontend  (comma-separated)"
        onChange={(e) => {
          setTagsInput(e.target.value);
          isDirty.current = true;
        }}
      />

      <div className="task-form-actions">
        {isEditing && onDelete && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <div className="task-form-right-actions">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Save changes" : "Create task"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
