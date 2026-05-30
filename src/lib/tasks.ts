import "server-only";
import { supabase } from "@/lib/supabase/supabaseServer";
import { COLUMN_ORDER } from "@/lib/taskColumns";

export const TASK_TABLE_COLUMNS: string[] = COLUMN_ORDER.slice(0, 11);

export async function fetchTasks(options?: { latestN?: number }) {
  let query = supabase
    .from("tasks")
    .select("*")
    .order("deployment_date", { ascending: false });

  if (options?.latestN != null) {
    query = query.limit(options.latestN);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
