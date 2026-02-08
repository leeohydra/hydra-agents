"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabaseClient";
import { LoginPageLayout } from "@/app/login/LoginPageLayout";
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

const linkStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#a3a3a3",
  textDecoration: "underline",
  marginTop: "0.5rem",
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session) setReady(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session) setReady(!!session);
    });

    checkSession();
    const t1 = setTimeout(checkSession, 600);
    const t2 = setTimeout(() => {
      if (mounted) setReady((prev) => prev ?? false);
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setSuccessMessage("Password updated. Redirecting to sign in…");
      await supabase.auth.signOut();
      setTimeout(() => router.push("/login?reset=1"), 1500);
    } finally {
      setIsLoading(false);
    }
  }

  if (ready === null) {
    return (
      <LoginPageLayout title="Reset password">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#a3a3a3", fontSize: "0.875rem" }}>
          <LoadingSpinner size={0.9} />
          Checking link…
        </div>
      </LoginPageLayout>
    );
  }

  if (ready === false) {
    return (
      <LoginPageLayout title="Reset password">
        <p style={{ ...errorStyle, marginBottom: "0.5rem" }}>
          Invalid or expired link. Request a new reset from the sign in page.
        </p>
        <Link href="/login" style={linkStyle}>
          Back to Sign in
        </Link>
      </LoginPageLayout>
    );
  }

  return (
    <LoginPageLayout title="Reset password">
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldStyle}>
          <label htmlFor="password" style={labelStyle}>
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="At least 6 characters"
            style={inputStyle}
            autoComplete="new-password"
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Same as above"
            style={inputStyle}
            autoComplete="new-password"
          />
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
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
      <Link href="/login" style={linkStyle}>
        Back to Sign in
      </Link>
    </LoginPageLayout>
  );
}
