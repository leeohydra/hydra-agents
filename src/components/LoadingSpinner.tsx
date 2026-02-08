"use client";

const spinnerStyle: React.CSSProperties = {
  display: "inline-block",
  width: "1em",
  height: "1em",
  border: "2px solid rgba(255,255,255,0.3)",
  borderTopColor: "currentColor",
  borderRadius: "50%",
  animation: "hydra-spin 0.7s linear infinite",
  verticalAlign: "middle",
  marginRight: "0.5em",
};

export function LoadingSpinner({ size = 1 }: { size?: number }) {
  return (
    <span
      style={{
        ...spinnerStyle,
        width: `${size}em`,
        height: `${size}em`,
      }}
      role="status"
      aria-hidden="true"
    />
  );
}
