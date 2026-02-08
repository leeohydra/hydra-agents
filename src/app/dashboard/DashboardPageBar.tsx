"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

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

export function DashboardPageBar({
  title,
  actions,
}: {
  title: React.ReactNode;
  actions: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div
      style={
        isMobile
          ? {
              ...pageBarStyle,
              flexDirection: "column",
              alignItems: "stretch",
              gap: "0.75rem",
              marginBottom: "1rem",
            }
          : pageBarStyle
      }
    >
      <h1
        style={
          isMobile ? { ...pageTitleStyle, fontSize: "1.25rem" } : pageTitleStyle
        }
      >
        {title}
      </h1>
      <div>{actions}</div>
    </div>
  );
}
