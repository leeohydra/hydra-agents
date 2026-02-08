"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ACCENT = "#3b82f6";

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
  color: "#fafafa",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "0.625rem 0.75rem",
  fontSize: "0.9375rem",
  background: "#262626",
  border: "1px solid rgba(64, 64, 64, 0.6)",
  borderRadius: "10px",
  color: "#fafafa",
  outline: "none",
  transition: "150ms ease",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "0.9375rem",
  fontWeight: 600,
  background: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "0.25rem",
  transition: "150ms ease",
};

const errorStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#f87171",
  margin: 0,
};

const successStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#86efac",
  margin: 0,
};

const forgotLinkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  fontSize: "0.8125rem",
  color: "#a3a3a3",
  cursor: "pointer",
  textDecoration: "underline",
  alignSelf: "flex-start",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  async function handleForgotPassword() {
    setError(null);
    setSuccessMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email above to reset password.");
      return;
    }
    setIsResetting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setSuccessMessage("Check your email for the reset link.");
    } finally {
      setIsResetting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
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
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isResetting}
          style={{
            ...forgotLinkStyle,
            ...(isResetting ? { opacity: 0.6, cursor: "wait" } : {}),
          }}
        >
          {isResetting ? "Sending…" : "Forgot password?"}
        </button>
      </div>
      {error && <p style={errorStyle}>{error}</p>}
      {successMessage && <p style={successStyle}>{successMessage}</p>}
      <button
        type="submit"
        className="hydra-btn-primary"
        disabled={isLoading}
        style={{
          ...primaryButtonStyle,
          ...(isLoading ? { opacity: 0.8, cursor: "wait" } : {}),
        }}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={0.9} />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
