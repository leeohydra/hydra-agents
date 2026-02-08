const wrapStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.5rem",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "24rem",
  background: "rgba(23, 23, 23, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(64, 64, 64, 0.6)",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 1.5rem 0",
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "#fafafa",
};

import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
