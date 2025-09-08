import React from "react";
import { type ModalComponentProps } from "../app/modal_lib/ModalProvider";
import { BaseModal } from "../app/modal_lib/BaseModal";
import ConfirmModalActions from "./ConfirmModalActions";

export interface ConfirmModalProps extends ModalComponentProps {
  message: string;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  ...baseModalProps
}) => {
  return (
    <BaseModal
      title="Подтвердите"
      size="sm"
      {...baseModalProps}
      renderActions={() => (
        <ConfirmModalActions
          onConfirm={onConfirm}
          onClose={baseModalProps.onClose}
        />
      )}
    >
      <p>{message}</p>
    </BaseModal>
  );
};
