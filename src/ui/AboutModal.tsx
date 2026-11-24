interface AboutModalProps {
  message: string;
  onClose: () => void;
}

export function AboutModal({ message, onClose }: AboutModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">⚠️</span>
          <h3 className="modal-title">PERINGATAN DARURAT NASIONAL</h3>
        </div>
        <p className="modal-message">{message}</p>
        <button
          className="modal-btn"
          onClick={onClose}
        >
          Makzulkan Pemerintah
        </button>
      </div>
    </div>
  );
}
