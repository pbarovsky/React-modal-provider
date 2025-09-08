import { useContext } from "react";
import { CurrentModalContext } from "../ModalProvider";

export function useModalProps() {
  const ctx = useContext(CurrentModalContext);
  if (!ctx)
    throw new Error(
      "useModalProps must be used inside a rendered modal component"
    );
  return ctx;
}
