import { useContext } from "react";
import { ModalContext, type ModalOpener } from "../app/modal_lib/ModalProvider";

export function useModalRenderer() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModalRenderer must be used inside <ModalProvider>");

  const open: ModalOpener = (component, props) => ctx.push(component, props, "open");
  const replace: ModalOpener = (component, props) => ctx.push(component, props, "replace");
  const replaceWithBack: ModalOpener = (component, props) => ctx.push(component, props, "replaceWithBack");

  return {
    stack: ctx.stack,
    open,
    replace,
    replaceWithBack,
    close: ctx.close,
    closeAll: ctx.closeAll,
  };
}
