import { useModalProps } from "./hooks/useModalProps";
import { Modal } from "./Modal";

export type BaseModalProps = Omit<
  React.ComponentProps<typeof Modal>,
  "isOpen" | "onClose" | "style"
>;

export function BaseModal(props: BaseModalProps) {
  const { isOpen, onClose } = useModalProps();

  return <Modal isOpen={isOpen} onClose={onClose} {...props} />;
}
