"use client";

import { RefObject } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { FORM_FIELD_GROUPS, COLUMN_LABELS } from "@/lib/taskColumns";
import { toDateInputValue } from "@/lib/format";

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.5rem 2rem",
};

const groupStyle: React.CSSProperties = {
  marginBottom: 0,
};

const groupTitleStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#a3a3a3",
  marginBottom: "0.5rem",
  paddingBottom: "0.25rem",
  borderBottom: "1px solid rgba(64, 64, 64, 0.5)",
  gridColumn: "1 / -1",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  marginBottom: "0.25rem",
  color: "#a3a3a3",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.5rem",
  fontSize: "0.875rem",
  background: "rgba(10, 10, 10, 0.6)",
  border: "1px solid #404040",
  borderRadius: "8px",
  color: "#fafafa",
  transition: "150ms ease",
};

type Row = Record<string, unknown>;

export function TaskFormFields({
  mode,
  defaultValues,
  firstInputRef,
}: {
  mode: "add" | "edit";
  defaultValues?: Row;
  firstInputRef?: RefObject<HTMLInputElement | null>;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const getLabel = (col: string) => COLUMN_LABELS[col] ?? col;
  let first = true;

  const gridStyle = isMobile
    ? { ...formGridStyle, gridTemplateColumns: "1fr", gap: "1rem" }
    : formGridStyle;
  const fieldsRowStyle = isMobile
    ? { display: "grid" as const, gridTemplateColumns: "1fr", gap: "0 0" }
    : { display: "grid" as const, gridTemplateColumns: "1fr 1fr", gap: "0 2rem" };

  return (
    <div style={gridStyle}>
      {FORM_FIELD_GROUPS.map((group) => (
        <div key={group.title} style={{ gridColumn: "1 / -1", ...groupStyle }}>
          <div style={groupTitleStyle}>{group.title}</div>
          <div style={fieldsRowStyle}>
            {group.fields.map((col) => {
              const isDate = col === "deployment_date";
              const ref = first ? firstInputRef : undefined;
              if (first) first = false;
              return (
                <div key={col} style={fieldStyle}>
                  <label htmlFor={`${mode}-${col}`} style={labelStyle}>
                    {getLabel(col)}
                  </label>
                  {isDate ? (
                    <input
                      ref={ref as RefObject<HTMLInputElement>}
                      id={`${mode}-${col}`}
                      name={col}
                      type="date"
                      defaultValue={defaultValues ? toDateInputValue(defaultValues[col]) : undefined}
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      ref={ref as RefObject<HTMLInputElement>}
                      id={`${mode}-${col}`}
                      name={col}
                      type="text"
                      defaultValue={defaultValues ? String(defaultValues[col] ?? "") : undefined}
                      style={inputStyle}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
