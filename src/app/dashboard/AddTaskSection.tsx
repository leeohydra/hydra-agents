"use client";

import { useEffect, useRef, useState } from "react";
import { addTask } from "./actions";
import { Modal } from "./Modal";
import { TaskFormFields } from "./TaskFormFields";

const primaryButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  fontWeight: 500,
  background: "#fafafa",
  color: "#0a0a0a",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const formActionsStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  paddingTop: "1rem",
  borderTop: "1px solid rgba(64, 64, 64, 0.5)",
  display: "flex",
  gap: "0.5rem",
};

export function AddTaskSection() {
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showForm]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving) return;
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
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        style={primaryButtonStyle}
      >
        Add task
      </button>
      <Modal
        open={showForm}
        onClose={() => !isSaving && setShowForm(false)}
        title="Add task"
      >
        <form onSubmit={handleSubmit}>
          <TaskFormFields mode="add" firstInputRef={firstInputRef} />
          <div style={formActionsStyle}>
            <button type="submit" disabled={isSaving} style={primaryButtonStyle}>
              {isSaving ? "Saving…" : "Save"}
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
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
