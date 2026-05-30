"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.875rem 1.5rem",
  borderBottom: "1px solid var(--border)",
  background: "rgba(10, 10, 11, 0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const mainStyle: React.CSSProperties = {
  padding: "2rem 1.5rem",
  maxWidth: "1400px",
  margin: "0 auto",
};

const brandWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
};

const brandMarkStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  background: "linear-gradient(180deg, #6366f1, #4f46e5)",
  boxShadow: "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
  fontSize: "0.95rem",
  fontWeight: 800,
  color: "#fff",
};

const appNameStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: "#fafafa",
};

const appSubStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 500,
  color: "var(--muted-2)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
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
        <div style={brandWrapStyle}>
          <span style={brandMarkStyle} aria-hidden>
            H
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
            <span style={appNameStyle}>Hydra Agents</span>
            {!isMobile && <span style={appSubStyle}>Admin</span>}
          </span>
        </div>
        <div>{logout}</div>
      </header>
      <main style={isMobile ? { ...mainStyle, padding: "1.25rem 1rem" } : mainStyle}>
        {children}
      </main>
    </div>
  );
}
