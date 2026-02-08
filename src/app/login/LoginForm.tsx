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

const passwordInputWrapperStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "stretch",
};

const eyeButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "0.5rem",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  padding: "0.25rem",
  cursor: "pointer",
  color: "#a3a3a3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        <div style={passwordInputWrapperStyle}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...inputStyle, paddingRight: "2.5rem" }}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={eyeButtonStyle}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            <EyeIcon show={!showPassword} />
          </button>
        </div>
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
