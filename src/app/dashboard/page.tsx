import {
  COLUMN_LABELS,
  COLUMN_ORDER,
  SECONDARY_COLUMNS,
} from "@/lib/taskColumns";
import { fetchTasks, TASK_TABLE_COLUMNS } from "@/lib/tasks";
import { AddTaskSection } from "./AddTaskSection";
import { DashboardPageBar } from "./DashboardPageBar";
import { DashboardShell } from "./DashboardShell";
import { DashboardTableWrapper } from "./DashboardTableWrapper";
import { DashboardViewControl } from "./DashboardViewControl";
import { FlashMessage } from "./FlashMessage";
import { LogoutButton } from "./LogoutButton";
import { TasksTable } from "./TasksTable";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; view?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "all" ? "all" : "30days";
  const sort =
    params.sort === "oldest"
      ? "oldest"
      : params.sort === "newest"
        ? "newest"
        : undefined;
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
      <DashboardPageBar title="Tasks" actions={<AddTaskSection />} />
      {params.saved === "1" && <FlashMessage />}
      <DashboardViewControl view={view} recordCount={rows.length} />
      <DashboardTableWrapper>
        <TasksTable
          rows={rows}
          columns={columns}
          columnLabels={COLUMN_LABELS}
          secondaryColumns={SECONDARY_COLUMNS}
          view={view}
          sort={sort}
        />
      </DashboardTableWrapper>
    </DashboardShell>
  );
}
