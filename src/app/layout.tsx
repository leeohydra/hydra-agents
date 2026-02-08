export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const bodyStyle = {
  margin: 0,
  minHeight: "100vh",
  background: "#0a0a0a",
  color: "#fafafa",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
