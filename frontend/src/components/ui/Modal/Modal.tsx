import { useEffect, useRef } from "react";
import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const FOCUSABLE =
  'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])';

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    requestAnimationFrame(() => {
      const firstField = containerRef.current?.querySelector<HTMLElement>(
        "input, textarea, select"
      );
      const firstFocusable = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (firstField ?? firstFocusable)?.focus();
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && containerRef.current) {
        const nodes = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        );
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="modal" ref={containerRef}>
        {title && (
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
        )}
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
