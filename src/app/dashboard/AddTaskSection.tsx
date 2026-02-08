"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { addTask } from "./actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toDateInputValue } from "@/lib/format";
import { FORM_COLUMNS } from "@/lib/taskColumns";
import { Modal } from "./Modal";
import { TaskFormFields } from "./TaskFormFields";

const ACCENT = "#3b82f6";

const primaryButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  fontWeight: 500,
  background: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "150ms ease",
};

const formActionsStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  paddingTop: "1rem",
  borderTop: "1px solid rgba(64, 64, 64, 0.5)",
  display: "flex",
  gap: "0.5rem",
};

const EMPTY_VALUES: Record<string, string> = {};
FORM_COLUMNS.forEach((col) => {
  EMPTY_VALUES[col] = "";
});

export function AddTaskSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm && firstInputRef.current) {
      firstInputRef.current.focus();
    }
    setIsDirty(false);
  }, [showForm]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving || !isDirty) return;
    setIsSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      await addTask({
        project: fd.get("project") as string,
        assigned_agent: fd.get("assigned_agent") as string,
        deployment_date: fd.get("deployment_date") as string,
        jurisdiction_country: fd.get("jurisdiction_country") as string,
        jurisdiction_city: fd.get("jurisdiction_city") as string,
        inquiry_via: fd.get("inquiry_via") as string,
        client_name: fd.get("client_name") as string,
        contacts: fd.get("contacts") as string,
        comms_channel: fd.get("comms_channel") as string,
        dd_doc: fd.get("dd_doc") as string,
        pay: fd.get("pay") as string,
      });
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={isMobile ? { width: "100%" } : undefined}>
      <button
        type="button"
        className="hydra-btn-primary"
        onClick={() => setShowForm(true)}
        style={isMobile ? { ...primaryButtonStyle, width: "100%", padding: "0.5rem 1rem" } : primaryButtonStyle}
      >
        Add task
      </button>
      <Modal
        open={showForm}
        onClose={() => !isSaving && setShowForm(false)}
        title="Add task"
      >
        <form
          onSubmit={handleSubmit}
          onChange={(e) => {
            const form = e.currentTarget;
            const fd = new FormData(form);
            let dirty = false;
            for (const col of FORM_COLUMNS) {
              const current = (fd.get(col) as string) ?? "";
              const original =
                col === "deployment_date"
                  ? toDateInputValue(EMPTY_VALUES[col])
                  : String(EMPTY_VALUES[col] ?? "");
              if (current !== original) {
                dirty = true;
                break;
              }
            }
            setIsDirty(dirty);
          }}
        >
          <TaskFormFields mode="add" firstInputRef={firstInputRef} />
          <div
            style={
              isMobile
                ? { ...formActionsStyle, flexDirection: "column" }
                : formActionsStyle
            }
          >
            <button
              type="submit"
              className="hydra-btn-primary"
              disabled={isSaving || !isDirty}
              style={{
                ...primaryButtonStyle,
                ...(isSaving || !isDirty
                  ? { opacity: 0.6, cursor: isSaving ? "wait" : "not-allowed" }
                  : {}),
              }}
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size={0.85} />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isSaving}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                background: "transparent",
                color: "#a3a3a3",
                border: "1px solid #404040",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "150ms ease",
              }}
            >
              Dismiss
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
