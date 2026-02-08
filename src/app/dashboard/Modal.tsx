"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const panelStyle: React.CSSProperties = {
  background: "rgba(23, 23, 23, 0.7)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  padding: "1.5rem",
  minWidth: "560px",
  maxWidth: "min(90vw, 720px)",
  maxHeight: "90vh",
  overflow: "auto",
  borderRadius: "12px",
  border: "1px solid rgba(64, 64, 64, 0.5)",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
};

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const isMobile = useMediaQuery("(max-width: 768px)");
  if (!open) return null;

  return (
    <div
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={panelRef}
        style={
          isMobile
            ? { ...panelStyle, minWidth: "auto", width: "calc(100vw - 2rem)", margin: "1rem", padding: "1rem" }
            : panelStyle
        }
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 id="modal-title" style={{ margin: 0, fontSize: "1.25rem", color: "#fafafa" }}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                lineHeight: 1,
                cursor: "pointer",
                padding: "0 0.25rem",
                color: "#a3a3a3",
              }}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
