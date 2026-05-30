"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useRouter } from "next/navigation";
import {
  formatDate,
  formatDateTime,
  formatRelative,
  toDateInputValue,
} from "@/lib/format";
import { COLUMN_LABELS, FORM_COLUMNS, FORM_FIELD_GROUPS } from "@/lib/taskColumns";
import { updateTask, deleteTask } from "./actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
  if (col === "updated_at") return formatRelative(value);
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
  transition: "150ms ease",
};

const actionsMenuStyle: React.CSSProperties = {
  position: "fixed",
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

const ACCENT = "#6366f1";

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
  view?: "latest30" | "all";
  sort?: "newest" | "oldest";
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [viewingRow, setViewingRow] = useState<Row | null>(null);
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [openMenuKey, setOpenMenuKey] = useState<string | number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(
    null
  );
  const portalMenuRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [deploySortMenuOpen, setDeploySortMenuOpen] = useState(false);
  const firstEditInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const deploySortMenuRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (view !== "all") setSearchQuery("");
  }, [view]);

  function toggleMenu(
    rowKey: string | number,
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    if (openMenuKey === rowKey) {
      setOpenMenuKey(null);
      setMenuPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const MENU_HEIGHT = 132;
    const openUp = rect.bottom + MENU_HEIGHT + 8 > window.innerHeight;
    setMenuPos({
      top: openUp ? rect.top - MENU_HEIGHT - 4 : rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
    setOpenMenuKey(rowKey);
  }

  const sortedRows = useMemo(() => {
    if (view !== "all" || !sort || !rows.length) return rows;
    const col = "deployment_date";
    return [...rows].sort((a, b) => {
      const va = a[col] != null ? new Date(String(a[col])).getTime() : 0;
      const vb = b[col] != null ? new Date(String(b[col])).getTime() : 0;
      return sort === "newest" ? vb - va : va - vb;
    });
  }, [rows, view, sort]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return sortedRows;
    const q = searchQuery.toLowerCase().trim();
    return sortedRows.filter((row) =>
      columns.some((col) => {
        const v = row[col];
        if (v == null) return false;
        return String(v).toLowerCase().includes(q);
      })
    );
  }, [sortedRows, searchQuery, columns]);

  useEffect(() => {
    if (editingRow && firstEditInputRef.current) {
      firstEditInputRef.current.focus();
    }
    setIsDirty(false);
  }, [editingRow]);

  useEffect(() => {
    if (openMenuKey === null) return;
    function closeMenu() {
      setOpenMenuKey(null);
      setMenuPos(null);
    }
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inTrigger = menuRef.current?.contains(target);
      const inMenu = portalMenuRef.current?.contains(target);
      if (!inTrigger && !inMenu) closeMenu();
    }
    document.addEventListener("click", handleClickOutside);
    // The menu is fixed-positioned to the trigger; once the user scrolls
    // it would detach, so just close it.
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
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
      setEditingRow(null);
      router.push("/dashboard?saved=1");
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
    setViewingRow(null);
    setEditingRow(row);
  }

  function openView(row: Row) {
    setOpenMenuKey(null);
    setViewingRow(row);
  }

  const isMobile = useMediaQuery("(max-width: 768px)");
  const getLabel = (col: string) => columnLabels[col] ?? col;

  const tableCellStyle: React.CSSProperties = isMobile
    ? {
        padding: "0.35rem 0.5rem",
        borderBottom: "1px solid rgba(64, 64, 64, 0.5)",
        verticalAlign: "top",
        color: "#fafafa",
        fontSize: "0.8125rem",
      }
    : {
        padding: "0.5rem 0.75rem",
        borderBottom: "1px solid rgba(64, 64, 64, 0.5)",
        verticalAlign: "top",
        color: "#fafafa",
      };

  const thStyle = (col: string): React.CSSProperties => ({
    ...tableCellStyle,
    textAlign: "left",
    fontWeight: 600,
    fontSize: "0.6875rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#8b8b94",
    whiteSpace: "nowrap",
    background: "var(--surface-2)",
    borderBottom: "1px solid var(--border-strong)",
    position: "sticky",
    top: 0,
    zIndex: 2,
  });

  // Cap individual cell width so long values (e.g. Pay notes) don't blow
  // out the table; full text is available via the title tooltip.
  const maxColWidth: Record<string, number> = {
    project: 200,
    pay: 220,
    inquiry_via: 160,
    contacts: 160,
    dd_doc: 140,
  };
  const cellClampStyle = (col: string): React.CSSProperties => {
    const w = maxColWidth[col];
    if (!w) return {};
    return {
      maxWidth: `${w}px`,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };
  };

  return (
    <>
      {view === "all" && (
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="search"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tasks"
            style={{
              width: isMobile ? "100%" : "min(20rem, 100%)",
              padding: isMobile ? "0.5rem 0.75rem" : "0.5rem 0.75rem",
              fontSize: isMobile ? "0.875rem" : "0.875rem",
              background: "rgba(10, 10, 10, 0.6)",
              border: "1px solid #404040",
              borderRadius: "8px",
              color: "#fafafa",
              outline: "none",
              transition: "150ms ease",
            }}
            className="hydra-search-input"
          />
        </div>
      )}
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
                  transition: "150ms ease",
                }}
              >
                Dismiss
              </button>
            </div>
          </form>
        )}
      </Modal>
      <Modal
        open={!!viewingRow}
        onClose={() => setViewingRow(null)}
        title="Task details"
      >
        {viewingRow && (
          <div>
            {FORM_FIELD_GROUPS.map((group) => (
              <div key={group.title} style={{ marginBottom: "1.25rem" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#8b8b94",
                    marginBottom: "0.5rem",
                    paddingBottom: "0.25rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {group.title}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "0.75rem 2rem",
                  }}
                >
                  {group.fields.map((col) => {
                    const text = cellDisplayValue(col, viewingRow[col], secondaryColumns);
                    return (
                      <div key={col}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#8b8b94",
                            marginBottom: "0.15rem",
                          }}
                        >
                          {getLabel(col)}
                        </div>
                        <div
                          style={{
                            fontSize: "0.9375rem",
                            color: text ? "#fafafa" : "#5b5b63",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {text || "—"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div
              style={{
                fontSize: "0.75rem",
                color: "#5b5b63",
                marginBottom: "1rem",
              }}
            >
              Last updated {formatRelative(viewingRow.updated_at)}
            </div>
            <div
              style={
                isMobile
                  ? { ...formActionsStyle, flexDirection: "column" }
                  : formActionsStyle
              }
            >
              <button
                type="button"
                className="hydra-btn-primary"
                onClick={() => openEdit(viewingRow)}
                style={primaryButtonStyle}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setViewingRow(null)}
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
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
      <table
        suppressHydrationWarning
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "var(--surface-2)" }}>
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
            <th style={{ ...tableCellStyle, ...actionsColumnBaseStyle, top: 0, zIndex: 3, background: "var(--surface-2)", boxShadow: "-4px 0 8px rgba(0,0,0,0.3)", fontWeight: 600, fontSize: "0.6875rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8b8b94", borderBottom: "1px solid var(--border-strong)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{
                  ...tableCellStyle,
                  color: "#a3a3a3",
                  textAlign: "center",
                  padding: isMobile ? "2rem 1rem" : "2rem",
                  verticalAlign: "middle",
                }}
              >
                {rows.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
                    <span style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
                      No records yet. Use the Add task button above to create your first task.
                    </span>
                  </div>
                ) : (
                  <span>No matching records for &quot;{searchQuery}&quot;</span>
                )}
              </td>
            </tr>
          )}
          {filteredRows.map((row, i) => {
            const rowKey =
              typeof row.id === "string" || typeof row.id === "number"
                ? row.id
                : i;
            const menuOpen = openMenuKey === rowKey;
            return (
              <tr
                key={rowKey}
                className="hydra-table-row"
                style={{ background: i % 2 === 0 ? "var(--surface)" : "#101014", transition: "background 150ms ease" }}
              >
                {columns.map((col) => {
                  const text = cellDisplayValue(col, row[col], secondaryColumns);
                  return (
                    <td
                      key={col}
                      title={text || undefined}
                      onClick={() => openView(row)}
                      style={{
                        ...tableCellStyle,
                        ...cellClampStyle(col),
                        cursor: "pointer",
                        fontSize: secondaryColumns.includes(col) ? "0.8125rem" : undefined,
                        color: secondaryColumns.includes(col) ? "#a3a3a3" : "#fafafa",
                      }}
                    >
                      {text}
                    </td>
                  );
                })}
                <td style={{ ...tableCellStyle, ...actionsColumnBaseStyle, background: i % 2 === 0 ? "var(--surface)" : "#101014", boxShadow: "-4px 0 8px rgba(0,0,0,0.3)", zIndex: menuOpen ? 100 : 1 }}>
                  <div
                    ref={menuOpen ? menuRef : undefined}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <button
                      type="button"
                      style={actionsButtonStyle}
                      onClick={(e) => toggleMenu(rowKey, e)}
                      disabled={isDeleting}
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                    >
                      Actions ▾
                    </button>
                    {menuOpen && menuPos && mounted &&
                      createPortal(
                        <div
                          ref={portalMenuRef}
                          style={{
                            ...actionsMenuStyle,
                            top: menuPos.top,
                            right: menuPos.right,
                          }}
                        >
                          <button
                            type="button"
                            style={actionsMenuItemStyle}
                            onClick={() => openView(row)}
                          >
                            View
                          </button>
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
                        </div>,
                        document.body
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
