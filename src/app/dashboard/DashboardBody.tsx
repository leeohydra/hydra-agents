"use client";

import { useMemo, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { DashboardViewControl } from "./DashboardViewControl";
import { DashboardTableWrapper } from "./DashboardTableWrapper";
import { TasksTable } from "./TasksTable";

type Row = Record<string, unknown>;

export function DashboardBody({
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
  view: "latest30" | "all";
  sort?: "newest" | "oldest";
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");

  // Count of rows matching the search, used for the view-control badge so it
  // reflects what's actually shown.
  const matchCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows.length;
    return rows.filter((row) =>
      columns.some((col) => {
        const v = row[col];
        return v != null && String(v).toLowerCase().includes(q);
      })
    ).length;
  }, [rows, columns, searchQuery]);

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="search"
          placeholder="Search tasks…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tasks"
          style={{
            width: isMobile ? "100%" : "min(22rem, 100%)",
            padding: "0.5rem 0.75rem",
            fontSize: "0.875rem",
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
      <DashboardViewControl view={view} recordCount={matchCount} />
      <DashboardTableWrapper>
        <TasksTable
          rows={rows}
          columns={columns}
          columnLabels={columnLabels}
          secondaryColumns={secondaryColumns}
          view={view}
          sort={sort}
          searchQuery={searchQuery}
        />
      </DashboardTableWrapper>
    </>
  );
}
