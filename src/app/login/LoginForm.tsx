"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#a3a3a3",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.9375rem",
  background: "rgba(10, 10, 10, 0.6)",
  border: "1px solid #404040",
  borderRadius: "8px",
  color: "#fafafa",
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "0.625rem 1rem",
  fontSize: "0.9375rem",
  fontWeight: 500,
  background: "#fafafa",
  color: "#0a0a0a",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "0.25rem",
};

const errorStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#f87171",
  margin: 0,
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="password" style={labelStyle}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      {error && <p style={errorStyle}>{error}</p>}
      <button type="submit" style={primaryButtonStyle}>Sign in</button>
    </form>
  );
}
