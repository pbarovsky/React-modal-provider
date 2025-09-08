interface ConfirmModalActionsProps {
  onClose: () => void;
  onConfirm?: () => void;
}

const ConfirmModalActions: React.FC<ConfirmModalActionsProps> = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={onClose}>Отмена</button>
      <button
        onClick={() => {
          onConfirm?.();
          onClose();
        }}
      >
        Ок
      </button>
    </div>
  );
};

export default ConfirmModalActions;
