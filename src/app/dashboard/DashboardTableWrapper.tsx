"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 30px rgba(0,0,0,0.35)",
};

export function DashboardTableWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div style={cardStyle}>
      <div
        style={
          isMobile
            ? { overflowX: "auto", WebkitOverflowScrolling: "touch" }
            : { overflowX: "auto" }
        }
      >
        {children}
      </div>
    </div>
  );
}
