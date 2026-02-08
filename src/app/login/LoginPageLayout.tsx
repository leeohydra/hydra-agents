"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

const wrapStyle: React.CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 1.5rem",
  boxSizing: "border-box",
};

const brandingStyle: React.CSSProperties = {
  position: "absolute",
  top: "2rem",
  left: "2rem",
  color: "#e5e5e5",
  letterSpacing: "0.02em",
};

const brandingTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
};

const brandingSubtitleStyle: React.CSSProperties = {
  margin: "0.25rem 0 0 0",
  fontSize: "0.8125rem",
  color: "#a3a3a3",
  fontWeight: 400,
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "24rem",
  background: "#171717",
  border: "1px solid rgba(64, 64, 64, 0.5)",
  borderRadius: "24px",
  padding: "2rem",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
  boxSizing: "border-box",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 1.5rem 0",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#fafafa",
};

export function LoginPageLayout({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="hydra-login-page">
      <div className="hydra-login-glow" aria-hidden />
      <div
        style={
          isMobile
            ? { ...wrapStyle, padding: "1.5rem 1rem" }
            : { ...wrapStyle, paddingLeft: "clamp(1.5rem, 8vw, 4rem)" }
        }
      >
        <div
          style={
            isMobile
              ? { ...brandingStyle, top: "1.5rem", left: "1rem", fontSize: "0.875rem" }
              : brandingStyle
          }
        >
          <p style={brandingTitleStyle}>HYDRA • ADMIN CONSOLE</p>
          <p style={brandingSubtitleStyle}>Internal Operations</p>
        </div>
        <div
          style={
            isMobile
              ? { ...cardStyle, padding: "1.5rem", maxWidth: "100%", borderRadius: "20px" }
              : cardStyle
          }
        >
          <h1
            style={
              isMobile
                ? { ...titleStyle, fontSize: "1.25rem", marginBottom: "1.25rem" }
                : titleStyle
            }
          >
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}
