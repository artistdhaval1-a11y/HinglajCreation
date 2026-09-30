import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hinglaj Creation | Custom Kurtas",
  description: "Custom men's kurtas with DTF prints, patch work and print + patch designs.",
  icons: { icon: "/hinglaj-logo.svg", apple: "/hinglaj-logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3H4N8RV276"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3H4N8RV276');
          `}
        </Script>
      </body>
    </html>
  );
}
