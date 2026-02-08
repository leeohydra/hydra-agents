import "server-only";
import { supabase } from "@/lib/supabase/supabaseServer";
import { COLUMN_ORDER } from "@/lib/taskColumns";

export const TASK_TABLE_COLUMNS: string[] = COLUMN_ORDER.slice(0, 11);

export async function fetchTasks(options?: { lastNDays?: number }) {
  let query = supabase
    .from("tasks")
    .select("*")
    .order("deployment_date", { ascending: false });

  if (options?.lastNDays != null) {
    const d = new Date();
    d.setDate(d.getDate() - options.lastNDays);
    const cutoff = d.toISOString().slice(0, 10);
    query = query.gte("deployment_date", cutoff);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
