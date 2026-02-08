import {
  COLUMN_LABELS,
  COLUMN_ORDER,
  SECONDARY_COLUMNS,
} from "@/lib/taskColumns";
import { fetchTasks, TASK_TABLE_COLUMNS } from "@/lib/tasks";
import { AddTaskSection } from "./AddTaskSection";
import { DashboardShell } from "./DashboardShell";
import { DashboardViewControl } from "./DashboardViewControl";
import { FlashMessage } from "./FlashMessage";
import { LogoutButton } from "./LogoutButton";
import { TasksTable } from "./TasksTable";

const pageBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
};

const pageTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "#fafafa",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; view?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "all" ? "all" : "30days";
  const tasks = await fetchTasks(
    view === "30days" ? { lastNDays: 30 } : undefined
  );
  const rows = (tasks ?? []) as Record<string, unknown>[];
  const firstRowKeys = rows.length > 0 ? Object.keys(rows[0]) : [];
  const HIDDEN_COLUMNS = ["created_at", "updated_at"];
  const columns = firstRowKeys.length
    ? COLUMN_ORDER.filter(
        (c) => firstRowKeys.includes(c) && !HIDDEN_COLUMNS.includes(c)
      )
    : TASK_TABLE_COLUMNS;

  return (
    <DashboardShell logout={<LogoutButton />}>
      <div style={pageBarStyle}>
        <h1 style={pageTitleStyle}>Tasks</h1>
        <AddTaskSection />
      </div>
      {params.saved === "1" && <FlashMessage />}
      <DashboardViewControl view={view} />
      <div style={{ overflowX: "auto" }}>
        <TasksTable
          rows={rows}
          columns={columns}
          columnLabels={COLUMN_LABELS}
          secondaryColumns={SECONDARY_COLUMNS}
        />
      </div>
    </DashboardShell>
  );
}
