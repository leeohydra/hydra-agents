"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseServer";

export async function addTask(form: {
  project?: string;
  assigned_agent?: string;
  deployment_date?: string;
  jurisdiction_country?: string;
  jurisdiction_city?: string;
  inquiry_via?: string;
  client_name?: string;
  contacts?: string;
  comms_channel?: string;
  dd_doc?: string;
  pay?: string;
}) {
  const record: Record<string, unknown> = {
    project: form.project ?? null,
    assigned_agent: form.assigned_agent ?? null,
    deployment_date: form.deployment_date || null,
    jurisdiction_country: form.jurisdiction_country ?? null,
    jurisdiction_city: form.jurisdiction_city ?? null,
    inquiry_via: form.inquiry_via ?? null,
    client_name: form.client_name ?? null,
    contacts: form.contacts ?? null,
    comms_channel: form.comms_channel ?? null,
    dd_doc: form.dd_doc ?? null,
    pay: form.pay ?? null,
  };
  const { error } = await supabase.from("tasks").insert(record);
  if (error) throw error;
  redirect("/dashboard?saved=1");
}

const FORM_KEYS = [
  "project",
  "assigned_agent",
  "deployment_date",
  "jurisdiction_country",
  "jurisdiction_city",
  "inquiry_via",
  "client_name",
  "contacts",
  "comms_channel",
  "dd_doc",
  "pay",
] as const;

function toRecord(form: Record<string, string | null | undefined>) {
  const record: Record<string, unknown> = {};
  for (const key of FORM_KEYS) {
    record[key] = form[key] ?? null;
  }
  return record;
}

export async function updateTask(
  id: string | number,
  form: {
    project?: string;
    assigned_agent?: string;
    deployment_date?: string;
    jurisdiction_country?: string;
    jurisdiction_city?: string;
    inquiry_via?: string;
    client_name?: string;
    contacts?: string;
    comms_channel?: string;
    dd_doc?: string;
    pay?: string;
  }
) {
  const record = toRecord(form);
  const { error } = await supabase.from("tasks").update(record).eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function deleteTask(id: string | number) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  redirect("/dashboard");
}
