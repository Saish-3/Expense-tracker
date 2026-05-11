/* ═══════════════════════════════════════════════════════════════
   MODAL COMPONENT
═══════════════════════════════════════════════════════════════ */
function Modal({ modal, onClose }) {
  if (!modal) return null;
  return (
    <div className={`et-modal-overlay${modal.open ? " show" : ""}`}>
      <div className="et-modal">
        {modal.icon && <span className="et-modal-icon">{modal.icon}</span>}
        <div className="et-modal-title">{modal.title}</div>
        <div className="et-modal-body" dangerouslySetInnerHTML={{ __html: modal.body }} />
        <div className="et-modal-actions">
          {modal.buttons.map((b, i) => (
            <button key={i} className={b.primary ? "et-modal-btn" : "et-modal-btn-sec"}
              onClick={() => { onClose(); b.action && b.action(); }}>{b.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
