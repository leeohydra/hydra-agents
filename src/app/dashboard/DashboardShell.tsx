"use client";

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

const appNameStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 600,
  color: "#fafafa",
};

const mainStyle: React.CSSProperties = {
  padding: "1.5rem",
  maxWidth: "1400px",
  margin: "0 auto",
};

export function DashboardShell({
  children,
  logout,
}: {
  children: React.ReactNode;
  logout: React.ReactNode;
}) {
  return (
    <div>
      <header style={headerStyle}>
        <span style={appNameStyle}>Hydra Agents Admin</span>
        <div>{logout}</div>
      </header>
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
