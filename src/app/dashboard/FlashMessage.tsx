"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function FlashMessage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/dashboard"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <p
      style={{
        margin: "0 0 1rem 0",
        padding: "0.5rem 0.75rem",
        background: "rgba(59, 130, 246, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#fafafa",
        fontSize: "0.875rem",
        borderRadius: "8px",
        border: "1px solid rgba(59, 130, 246, 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        transition: "opacity 150ms ease",
      }}
    >
      <span style={{ color: "#22c55e" }} aria-hidden>✓</span>
      Saved successfully
    </p>
  );
}
