"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 1.5rem",
  borderBottom: "1px solid rgba(64, 64, 64, 0.5)",
  background: "rgba(23, 23, 23, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const mainStyle: React.CSSProperties = {
  padding: "1.5rem",
  maxWidth: "1400px",
  margin: "0 auto",
};

const appNameStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 600,
  color: "#fafafa",
};

export function DashboardShell({
  children,
  logout,
}: {
  children: React.ReactNode;
  logout: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div>
      <header
        style={isMobile ? { ...headerStyle, padding: "0.75rem 1rem" } : headerStyle}
      >
        <span
          style={isMobile ? { ...appNameStyle, fontSize: "1rem" } : appNameStyle}
        >
          Admin Panel
        </span>
        <div>{logout}</div>
      </header>
      <main
        style={isMobile ? { ...mainStyle, padding: "1rem" } : mainStyle}
      >
        {children}
      </main>
    </div>
  );
}
