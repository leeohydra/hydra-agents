"use client";

import { useRouter } from "next/navigation";

const indicatorStyle: React.CSSProperties = {
  margin: "0 0 0.75rem 0",
  fontSize: "0.875rem",
  color: "#a3a3a3",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.8125rem",
  background: "transparent",
  color: "#a3a3a3",
  border: "1px solid #404040",
  borderRadius: "8px",
  cursor: "pointer",
};

export function DashboardViewControl({
  view,
}: {
  view: "30days" | "all";
}) {
  const router = useRouter();

  return (
    <div>
      <p style={indicatorStyle}>
        {view === "30days"
          ? "Showing records from the last 30 days"
          : "Showing all records"}
      </p>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => {
          router.push(view === "30days" ? "/dashboard?view=all" : "/dashboard");
        }}
      >
        {view === "30days" ? "Show all records" : "Last 30 days"}
      </button>
    </div>
  );
}
