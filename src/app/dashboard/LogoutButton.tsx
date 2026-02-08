"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const logoutStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.875rem",
  background: "transparent",
  color: "#a3a3a3",
  border: "1px solid #404040",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "150ms ease",
};

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      style={{ ...logoutStyle, ...(isLoading ? { opacity: 0.7, cursor: "wait" } : {}) }}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={0.8} />
          Signing out…
        </>
      ) : (
        "Log out"
      )}
    </button>
  );
}
