"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1rem",
  flexWrap: "wrap",
};

const captionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.875rem",
  color: "var(--muted)",
};

const countBadgeStyle: React.CSSProperties = {
  marginLeft: "0.5rem",
  padding: "0.05rem 0.45rem",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--border)",
  fontSize: "0.75rem",
  color: "var(--muted)",
};

const segmentWrapStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "3px",
  gap: "2px",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
};

function segmentStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.35rem 0.8rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "150ms ease",
    background: active ? "rgba(99, 102, 241, 0.18)" : "transparent",
    color: active ? "#fafafa" : "var(--muted)",
    boxShadow: active ? "inset 0 0 0 1px rgba(99,102,241,0.35)" : "none",
  };
}

export function DashboardViewControl({
  view,
  recordCount = 0,
}: {
  view: "latest30" | "all";
  recordCount?: number;
}) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [pending, setPending] = useState<null | "latest30" | "all">(null);

  useEffect(() => {
    setPending(null);
  }, [view]);

  function go(target: "latest30" | "all") {
    if (target === view || pending) return;
    setPending(target);
    router.push(target === "all" ? "/dashboard?view=all" : "/dashboard");
  }

  return (
    <div
      style={
        isMobile
          ? { ...rowStyle, flexDirection: "column", alignItems: "stretch" }
          : rowStyle
      }
    >
      <p style={captionStyle}>
        {view === "latest30" ? "Latest 30 records" : "All records"}
        {recordCount > 0 && (
          <span style={countBadgeStyle}>{recordCount}</span>
        )}
      </p>
      <div
        style={segmentWrapStyle}
        role="tablist"
        aria-label="Filter records by time range"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === "latest30"}
          disabled={!!pending}
          style={segmentStyle(view === "latest30")}
          onClick={() => go("latest30")}
        >
          {pending === "latest30" && <LoadingSpinner size={0.75} />}
          Latest 30
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "all"}
          disabled={!!pending}
          style={segmentStyle(view === "all")}
          onClick={() => go("all")}
        >
          {pending === "all" && <LoadingSpinner size={0.75} />}
          All
        </button>
      </div>
    </div>
  );
}
