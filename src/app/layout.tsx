import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { ModeToggle } from "@/components/modeToggle";
import { InstallPrompt } from "@/components/installPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paprika - Read article",
  description: "Generated with galp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className="light">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Paprika" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="apple-touch-startup-image"
          href="/splash.png"
          media="(device-width: 320px) and (device-height: 568px)"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex justify-end px-4 py-2">
            <ModeToggle />
          </div>

          {children}
          <InstallPrompt />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
