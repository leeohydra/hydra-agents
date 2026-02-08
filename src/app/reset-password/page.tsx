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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <div style={passwordInputWrapperStyle}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              style={{ ...inputStyle, paddingRight: "2.5rem" }}
              autoComplete="new-password"
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
        </div>
        <div style={fieldStyle}>
          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirm password
          </label>
          <div style={passwordInputWrapperStyle}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Same as above"
              style={{ ...inputStyle, paddingRight: "2.5rem" }}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              style={eyeButtonStyle}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              <EyeIcon show={!showConfirmPassword} />
            </button>
          </div>
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
