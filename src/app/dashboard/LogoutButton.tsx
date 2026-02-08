"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";

const logoutStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.875rem",
  background: "transparent",
  color: "#a3a3a3",
  border: "1px solid #404040",
  borderRadius: "8px",
  cursor: "pointer",
};

export function LogoutButton() {
  const router = useRouter();

  async function handleClick() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleClick} style={logoutStyle}>
      Log out
    </button>
  );
}
