export const COLUMN_ORDER = [
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
  "created_at",
  "updated_at",
] as const;

export const FORM_COLUMNS = COLUMN_ORDER.slice(0, 11);

export const COLUMN_LABELS: Record<string, string> = {
  project: "Project",
  assigned_agent: "Assigned Agent",
  deployment_date: "Deployment Date",
  jurisdiction_country: "Jurisdiction Country",
  jurisdiction_city: "Jurisdiction City",
  inquiry_via: "Inquiry Via",
  client_name: "Client Name",
  contacts: "Contacts",
  comms_channel: "Comms Channel",
  dd_doc: "DD / DOC",
  pay: "Pay",
  created_at: "Created At",
  updated_at: "Updated At",
};

export const SECONDARY_COLUMNS = ["created_at", "updated_at"];

export const FORM_FIELD_GROUPS: { title: string; fields: readonly string[] }[] = [
  { title: "Project", fields: ["project", "assigned_agent", "deployment_date"] },
  { title: "Jurisdiction", fields: ["jurisdiction_city", "jurisdiction_country"] },
  { title: "Client & inquiry", fields: ["inquiry_via", "client_name", "contacts", "comms_channel"] },
  { title: "Commercial", fields: ["dd_doc", "pay"] },
];
