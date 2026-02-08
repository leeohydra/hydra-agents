"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatDateTime, toDateInputValue } from "@/lib/format";
import { COLUMN_LABELS, FORM_COLUMNS } from "@/lib/taskColumns";
import { updateTask, deleteTask } from "./actions";
import { Modal } from "./Modal";
import { TaskFormFields } from "./TaskFormFields";

type Row = Record<string, unknown>;

function cellDisplayValue(
  col: string,
  value: unknown,
  secondaryColumns: string[]
): string {
  if (value == null || value === "") return "";
  if (col === "deployment_date") return formatDate(value);
  if (secondaryColumns.includes(col)) return formatDateTime(value);
  return String(value);
}

const actionsColumnBaseStyle: React.CSSProperties = {
  width: "1%",
  whiteSpace: "nowrap",
  padding: "0.5rem 0.75rem",
  verticalAlign: "middle",
  position: "sticky",
  right: 0,
  zIndex: 1,
};

const actionsButtonStyle: React.CSSProperties = {
  padding: "0.35rem 0.6rem",
  fontSize: "0.8125rem",
  cursor: "pointer",
  background: "rgba(23, 23, 23, 0.8)",
  color: "#fafafa",
  border: "1px solid #404040",
  borderRadius: "8px",
};

const actionsMenuStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
  bottom: "100%",
  marginBottom: "2px",
  background: "rgba(23, 23, 23, 0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(64, 64, 64, 0.6)",
  borderRadius: "8px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  zIndex: 9999,
  minWidth: "8rem",
};

const deploySortMenuStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: "100%",
  marginTop: "2px",
  background: "rgba(23, 23, 23, 0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(64, 64, 64, 0.6)",
  borderRadius: "8px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  zIndex: 9999,
  minWidth: "8rem",
};

const actionsMenuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.5rem 0.75rem",
  textAlign: "left",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "0.875rem",
  color: "#fafafa",
};

const actionsMenuItemDangerStyle: React.CSSProperties = {
  ...actionsMenuItemStyle,
  color: "#f87171",
  borderTop: "1px solid rgba(64, 64, 64, 0.6)",
};

const formActionsStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  paddingTop: "1rem",
  borderTop: "1px solid rgba(64, 64, 64, 0.5)",
  display: "flex",
  gap: "0.5rem",
};

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

export function TasksTable({
  rows,
  columns,
  columnLabels,
  secondaryColumns,
  view,
  sort,
}: {
  rows: Row[];
  columns: string[];
  columnLabels: Record<string, string>;
  secondaryColumns: string[];
  view?: "30days" | "all";
  sort?: "newest" | "oldest";
}) {
  const router = useRouter();
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [openMenuKey, setOpenMenuKey] = useState<string | number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [deploySortMenuOpen, setDeploySortMenuOpen] = useState(false);
  const firstEditInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const deploySortMenuRef = useRef<HTMLDivElement>(null);

  const sortedRows = useMemo(() => {
    if (view !== "all" || !sort || !rows.length) return rows;
    const col = "deployment_date";
    return [...rows].sort((a, b) => {
      const va = a[col] != null ? new Date(String(a[col])).getTime() : 0;
      const vb = b[col] != null ? new Date(String(b[col])).getTime() : 0;
      return sort === "newest" ? vb - va : va - vb;
    });
  }, [rows, view, sort]);

  useEffect(() => {
    if (editingRow && firstEditInputRef.current) {
      firstEditInputRef.current.focus();
    }
    setIsDirty(false);
  }, [editingRow]);

  useEffect(() => {
    if (openMenuKey === null) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuKey(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuKey]);

  useEffect(() => {
    if (!deploySortMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        deploySortMenuRef.current &&
        !deploySortMenuRef.current.contains(e.target as Node)
      ) {
        setDeploySortMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [deploySortMenuOpen]);

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingRow || editingRow.id == null || isSaving || !isDirty) return;
    setIsSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      await updateTask(editingRow.id as string | number, {
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
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(row: Row) {
    if (row.id == null || isDeleting) return;
    setOpenMenuKey(null);
    const ok = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!ok) return;
    setIsDeleting(true);
    try {
      await deleteTask(row.id as string | number);
    } finally {
      setIsDeleting(false);
    }
  }

  function openEdit(row: Row) {
    setOpenMenuKey(null);
    setIsDirty(false);
    setEditingRow(row);
  }

  const getLabel = (col: string) => columnLabels[col] ?? col;

  const tableCellStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    borderBottom: "1px solid rgba(64, 64, 64, 0.5)",
    verticalAlign: "top",
    color: "#fafafa",
  };

  const thStyle = (col: string): React.CSSProperties => ({
    ...tableCellStyle,
    textAlign: "left",
    fontWeight: 600,
    fontSize: secondaryColumns.includes(col) ? "0.8125rem" : "0.875rem",
    color: "#a3a3a3",
  });

  return (
    <>
      <Modal
        open={!!editingRow}
        onClose={() => !isSaving && setEditingRow(null)}
        title="Edit task"
      >
        {editingRow && (
          <form
            onSubmit={handleEditSubmit}
            onChange={(e) => {
              const form = e.currentTarget;
              const fd = new FormData(form);
              let dirty = false;
              for (const col of FORM_COLUMNS) {
                const current = (fd.get(col) as string) ?? "";
                const original =
                  col === "deployment_date"
                    ? toDateInputValue(editingRow[col])
                    : String(editingRow[col] ?? "");
                if (current !== original) {
                  dirty = true;
                  break;
                }
              }
              setIsDirty(dirty);
            }}
          >
            <TaskFormFields
              mode="edit"
              defaultValues={editingRow}
              firstInputRef={firstEditInputRef}
            />
            <div style={formActionsStyle}>
              <button
                type="submit"
                disabled={isSaving || !isDirty}
                style={{
                  ...primaryButtonStyle,
                  ...(isSaving || !isDirty
                    ? { opacity: 0.5, cursor: "not-allowed" }
                    : {}),
                }}
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
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
                Dismiss
              </button>
            </div>
          </form>
        )}
      </Modal>
      <table
        suppressHydrationWarning
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#171717" }}>
            {columns.map((col) => {
              const isDeployDate = col === "deployment_date";
              const canSort = view === "all" && isDeployDate;
              return (
                <th key={col} style={thStyle(col)}>
                  {canSort ? (
                    <div
                      ref={deploySortMenuOpen ? deploySortMenuRef : undefined}
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setDeploySortMenuOpen((prev) => !prev)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          font: "inherit",
                          color: "inherit",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                        aria-expanded={deploySortMenuOpen}
                        aria-haspopup="true"
                      >
                        {getLabel(col)}
                        <span aria-hidden>▾</span>
                      </button>
                      {deploySortMenuOpen && (
                        <div style={deploySortMenuStyle}>
                          {sort === "oldest" && (
                            <button
                              type="button"
                              style={actionsMenuItemStyle}
                              onClick={() => {
                                router.push("/dashboard?view=all&sort=newest");
                                setDeploySortMenuOpen(false);
                              }}
                            >
                              Sort by newest first
                            </button>
                          )}
                          {sort !== "oldest" && (
                            <button
                              type="button"
                              style={actionsMenuItemStyle}
                              onClick={() => {
                                router.push("/dashboard?view=all&sort=oldest");
                                setDeploySortMenuOpen(false);
                              }}
                            >
                              Sort by oldest first
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    getLabel(col)
                  )}
                </th>
              );
            })}
            <th style={{ ...tableCellStyle, ...actionsColumnBaseStyle, background: "#171717", boxShadow: "-4px 0 8px rgba(0,0,0,0.3)", fontWeight: 600, fontSize: "0.875rem", color: "#a3a3a3" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{ ...tableCellStyle, color: "#a3a3a3", textAlign: "center", padding: "2rem" }}
              >
                No records found
              </td>
            </tr>
          )}
          {sortedRows.map((row, i) => {
            const rowKey =
              typeof row.id === "string" || typeof row.id === "number"
                ? row.id
                : i;
            const menuOpen = openMenuKey === rowKey;
            return (
              <tr key={rowKey} style={{ background: i % 2 === 0 ? "#0a0a0a" : "#171717" }}>
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      ...tableCellStyle,
                      fontSize: secondaryColumns.includes(col) ? "0.8125rem" : undefined,
                      color: secondaryColumns.includes(col) ? "#a3a3a3" : "#fafafa",
                    }}
                  >
                    {cellDisplayValue(col, row[col], secondaryColumns)}
                  </td>
                ))}
                <td style={{ ...tableCellStyle, ...actionsColumnBaseStyle, background: i % 2 === 0 ? "#0a0a0a" : "#171717", boxShadow: "-4px 0 8px rgba(0,0,0,0.3)", zIndex: menuOpen ? 100 : 1 }}>
                  <div
                    ref={menuOpen ? menuRef : undefined}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <button
                      type="button"
                      style={actionsButtonStyle}
                      onClick={() => setOpenMenuKey(menuOpen ? null : rowKey)}
                      disabled={isDeleting}
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                    >
                      Actions ▾
                    </button>
                    {menuOpen && (
                      <div style={actionsMenuStyle}>
                        <button
                          type="button"
                          style={actionsMenuItemStyle}
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          style={actionsMenuItemDangerStyle}
                          onClick={() => handleDelete(row)}
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
