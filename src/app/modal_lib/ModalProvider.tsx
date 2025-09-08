import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  type ComponentType,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";

export interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
}

type ModalRenderer = (injected: ModalComponentProps) => ReactElement | null;

interface ModalEntry {
  id: string;
  renderer: ModalRenderer;
  isVisible: boolean;
}

export type ModalMode = "open" | "replace" | "replaceWithBack";

interface ModalContextValue {
  stack: ModalEntry[];
  push: ModalOpener;
  close: (id?: string) => void;
  closeAll: () => void;
}

export type ModalOpener = <TProps extends ModalComponentProps>(
  component: ComponentType<TProps>,
  props: Omit<TProps, keyof ModalComponentProps>,
  mode?: ModalMode
) => string;

const ANIMATION_DURATION = 240;

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const CurrentModalContext = createContext<ModalComponentProps | null>(
  null
);

const makeRenderer =
  <TProps extends ModalComponentProps>(
    Component: ComponentType<TProps>,
    props: Omit<TProps, keyof ModalComponentProps>
  ): ModalRenderer =>
  (injected) =>
    <Component {...({ ...props, ...injected } as TProps)} />;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ModalEntry[]>([]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack.length > 0) close();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [stack]);

  const push: ModalOpener = (Component, props, mode = "open") => {
    const id = crypto.randomUUID();
    const newEntry: ModalEntry = {
      id,
      renderer: makeRenderer(Component, props),
      isVisible: false,
    };

    setStack((prev) => {
      const base = [...prev];
      if (mode === "replace")
        return base.length ? [...base.slice(0, -1), newEntry] : [newEntry];
      if (mode === "replaceWithBack") {
        if (base.length) {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          base[base.length - 1] = {
            ...base[base.length - 1],
            isVisible: false,
          };
        }

        return [...base, newEntry];
      }
      return [...base, newEntry];
    });

    requestAnimationFrame(() => {
      setStack((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isVisible: true } : m))
      );
    });

    return id;
  };

  const close = (id?: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setStack((prev) => {
      if (!prev.length) return prev;
      const index = id ? prev.findIndex((m) => m.id === id) : prev.length - 1;
      if (index === -1) return prev;

      const newStack = [...prev];
      newStack[index] = { ...newStack[index], isVisible: false };

      if (newStack.length > 1 && index === newStack.length - 1) {
        newStack[newStack.length - 2] = {
          ...newStack[newStack.length - 2],
          isVisible: true,
        };
      }

      const removeId = newStack[index].id;
      setTimeout(
        () => setStack((cur) => cur.filter((m) => m.id !== removeId)),
        ANIMATION_DURATION
      );
      return newStack;
    });
  };

  const closeAll = () => setStack([]);

  return (
    <ModalContext.Provider value={{ stack, push, close, closeAll }}>
      {children}
      {createPortal(
        stack.map(({ id, renderer, isVisible }, i) => {
          const injected: ModalComponentProps = {
            isOpen: isVisible,
            onClose: () => close(id),
            style: { zIndex: 1000 + i },
          };

          return (
            <CurrentModalContext.Provider value={injected} key={id}>
              {renderer(injected)}
            </CurrentModalContext.Provider>
          );
        }),
        document.body
      )}
    </ModalContext.Provider>
  );
}
