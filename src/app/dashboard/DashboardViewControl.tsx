"use client";

import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/useMediaQuery";

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
  transition: "150ms ease",
};

export function DashboardViewControl({
  view,
  recordCount = 0,
}: {
  view: "30days" | "all";
  recordCount?: number;
}) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <p
        style={
          isMobile
            ? { ...indicatorStyle, fontSize: "0.8125rem", marginBottom: "0.5rem" }
            : indicatorStyle
        }
      >
        {view === "30days"
          ? "Showing records from the last 30 days"
          : "Showing all records"}
        {recordCount > 0 && (
          <span style={{ marginLeft: "0.5rem", color: "#737373" }}>
            ({recordCount} {recordCount === 1 ? "record" : "records"})
          </span>
        )}
      </p>
      <button
        type="button"
        style={
          isMobile
            ? { ...buttonStyle, padding: "0.25rem 0.5rem", fontSize: "0.75rem" }
            : buttonStyle
        }
        onClick={() => {
          router.push(view === "30days" ? "/dashboard?view=all" : "/dashboard");
        }}
      >
        {view === "30days" ? "Show all records" : "Last 30 days"}
      </button>
    </div>
  );
}
