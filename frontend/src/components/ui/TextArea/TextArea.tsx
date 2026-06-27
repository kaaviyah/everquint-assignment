import "./TextArea.css";

type TextAreaProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function TextArea({
  label,
  name,
  value,
  placeholder,
  rows = 4,
  onChange,
}: TextAreaProps) {
  return (
    <div className="textarea-group">
      <label htmlFor={name}>{label}</label>

      <textarea
        id={name}
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

export default TextArea;