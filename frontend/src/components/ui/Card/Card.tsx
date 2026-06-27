import "./Card.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
};

function Card({ children, className = "", onClick, draggable, onDragStart }: CardProps) {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export default Card;
