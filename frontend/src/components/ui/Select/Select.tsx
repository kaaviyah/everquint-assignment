import "./Select.css";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function Select({
  label,
  name,
  value,
  options,
  onChange,
}: SelectProps) {
  return (
    <div className="select-group">
      <label htmlFor={name}>{label}</label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;