import "./Badge.css";

type BadgeVariant = "default" | "low" | "medium" | "high" | "tag";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

function Badge({ children, variant = "default" }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export default Badge;
