"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

export function DashboardTableWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div
      style={
        isMobile
          ? { overflowX: "auto", marginLeft: "-1rem", marginRight: "-1rem", paddingLeft: "1rem", paddingRight: "1rem" }
          : { overflowX: "auto" }
      }
    >
      {children}
    </div>
  );
}
