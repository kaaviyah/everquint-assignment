import "./Button.css";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
};

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${variant} ${size}`}
    >
      {children}
    </button>
  );
}

export default Button;