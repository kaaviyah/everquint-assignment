import { useState } from "react";
import TextInput from "../../ui/TextInput";
import TextArea from "../../ui/TextArea";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import "./TaskForm.css";

type TaskFormProps = {
  onAdd: (task: {
    title: string;
    description: string;
    status: string;
  }) => void;
};

function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Backlog");
  const [titleError, setTitleError] = useState("");

  const handleAdd = () => {
     if (!title.trim()) {
    setTitleError("Title is required");
    return;
  }
    onAdd({
      title,
      description,
      status,
    });
    setTitle("");
    setDescription("");
    setStatus("Backlog");
  };

  return (
    <div className="task-form">
     <div className="field">
  <TextInput
    label="Title"
    name="title"
    value={title}
    onChange={(e) => {
      setTitle(e.target.value);
      setTitleError("");
    }}
  />

  {titleError && (
    <span className="error-message">
      {titleError}
    </span>
  )}
</div>

      <TextArea
        label="Description"
        name="description"
        value={description}
        placeholder="Enter task description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <Select
        label="Status"
        name="status"
        value={status}
        options={[
          { label: "Backlog", value: "Backlog" },
          { label: "In Progress", value: "In Progress" },
          { label: "Done", value: "Done" },
        ]}
        onChange={(e) => setStatus(e.target.value)}
      />

      <div className="task-form-actions">
        <Button onClick={handleAdd}>
          Add
        </Button>
      </div>
    </div>
  );
}

export default TaskForm;