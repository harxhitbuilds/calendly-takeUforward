import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import ThemeProvider from "@/providers/theme-provider";

import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Calendly - TakeUForward Internship Task",
  description: "This is assignment for TakeUForward Internship Task.",
  openGraph: {
    title: "Calendly - TakeUForward Internship Task",
    description: "This is assignment for TakeUForward Internship Task.",
    url: "https://calendly.harshitparmar.in",
    siteName: "Calendly Clone",
    images: [
      {
        url: "/marketing/og.png",
        width: 1200,
        height: 630,
        alt: "Calendly Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calendly - TakeUForward Internship Task",
    description: "This is assignment for TakeUForward Internship Task.",
    images: ["/marketing/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${grotesk.variable} ${inter.variable} bg-background text-foreground antialiased`}
      >
        {" "}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
