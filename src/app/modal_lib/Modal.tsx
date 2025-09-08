import React, { useEffect, useRef, useState, type ReactNode } from "react";

import ReactDOM from "react-dom";
import "./modal.css";

type Size = "sm" | "md" | "lg" | "full";

export interface ModalProps {
  isOpen: boolean;
  title?: ReactNode;
  children?: ReactNode;
  size?: Size;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  animationDuration?: number;
  className?: string;
  backdropClassName?: string;
  id?: string;
  ariaLabel?: string;
  container?: Element | null;
  preventBodyScroll?: boolean;
  titleIcon?: string;
  showBackdrop?: boolean;
  onClose: () => void;
  renderHeader?: () => ReactNode;
  renderActions?: () => ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
  animationDuration = 400,
  className = "",
  backdropClassName = "",
  id,
  ariaLabel,
  container = typeof document !== "undefined" ? document.body : null,
  preventBodyScroll = true,
  titleIcon,
  showBackdrop = true,
  renderHeader,
  renderActions,
}) => {
  const [mounted, setMounted] = useState<boolean>(isOpen);
  const [visible, setVisible] = useState<boolean>(isOpen);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });

      if (preventBodyScroll) {
        document.body.style.overflow = "hidden";
      }
      return;
    }

    setVisible(false);
    window.clearTimeout(closeTimeoutRef.current ?? 0);
    closeTimeoutRef.current = window.setTimeout(() => {
      setMounted(false);
      if (preventBodyScroll) document.body.style.overflow = "";
      if (previouslyFocused.current instanceof HTMLElement) {
        (previouslyFocused.current as HTMLElement).focus();
      }
    }, animationDuration);
    return () => {
      window.clearTimeout(closeTimeoutRef.current ?? 0);
    };
  }, [isOpen, animationDuration, preventBodyScroll]);

  if (!mounted || !container) return null;

  const sizeClass = `modal--${size}`;

  const modal = (
    <div
      className={`modal-portal ${
        visible ? "modal-visible" : "modal-hidden"
      } ${className}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`modal-backdrop ${
          visible ? (showBackdrop ? "backdrop-visible" : "") : "backdrop-hidden"
        } ${backdropClassName}`}
        onMouseDown={() => {
          if (closeOnBackdrop) onClose();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          aria-label={ariaLabel}
          className={`modal ${sizeClass}`}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ transitionDuration: `${animationDuration}ms` }}
          ref={contentRef}
        >
          <div
            className="modal-card"
            style={{ transitionDuration: `${animationDuration}ms` }}
          >
            <div className="modal-header">
              {renderHeader ? (
                <>
                  {renderHeader()}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={onClose}
                      aria-label="Close dialog"
                    >
                      ×
                    </button>
                  )}
                </>
              ) : (
                <>
                  {title && (
                    <h2
                      id={`${id}-title`}
                      className="modal-title"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {titleIcon && (
                        <img
                          src={titleIcon}
                          alt="icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      {title}
                    </h2>
                  )}

                  {showCloseButton && (
                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={onClose}
                      aria-label="Close dialog"
                    >
                      ×
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="modal-body">{children}</div>

            {renderActions && (
              <div className="modal-footer">{renderActions()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!container) return null;

  return ReactDOM.createPortal(modal, container);
};
