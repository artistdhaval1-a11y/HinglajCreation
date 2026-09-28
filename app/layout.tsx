import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hinglaj Creation | Custom Kurtas",
  description: "Custom men's kurtas with DTF prints, patch work and print + patch designs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
