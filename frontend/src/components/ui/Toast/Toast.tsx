import { useEffect } from "react";
import type { ToastItem } from "../../../hooks/useToast";
import "./Toast.css";

type ToastProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <ToastEntry key={t.id} item={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastEntry({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), 3500);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  return (
    <div className={`toast toast-${item.type}`} role="status">
      <span className="toast-message">{item.message}</span>
      <button
        className="toast-dismiss"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
