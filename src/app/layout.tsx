import { Inter } from "next/font/google";

export const metadata = {
  title: "Hydra Agents — Admin",
  description: "Hydra Agents internal operations admin console.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bodyStyle = {
  margin: 0,
  minHeight: "100vh",
  background:
    "radial-gradient(1100px 520px at 50% -8%, rgba(99, 102, 241, 0.10), transparent 70%), #0a0a0b",
  backgroundAttachment: "fixed" as const,
  color: "#fafafa",
  fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
  WebkitFontSmoothing: "antialiased" as const,
};

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
