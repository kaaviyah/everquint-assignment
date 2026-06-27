import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="close-button"
          onClick={onClose}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

export default Modal;