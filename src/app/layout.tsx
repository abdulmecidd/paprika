import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { InstallPrompt } from "@/components/installPrompt";
import { Navbar } from "@/components/navbar";
import { I18nProvider } from "@/components/i18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paprika - Multi-Source Academic Search",
  description: "A unified, open-source research engine bridging OpenAlex and Crossref. Discover millions of scholarly articles, journals, and open-access publications instantly.",
  keywords: ["paprika", "academic", "research", "openalex", "crossref", "open access", "articles", "journals", "search engine"],
  authors: [{ name: "Abdulmecid", url: "https://github.com/abdulmecidd/paprika" }],
  creator: "Abdulmecid",
  openGraph: {
    title: "Paprika - Academic Research Engine",
    description: "Instantly aggregate Crossref and OpenAlex to find the most relevant academic articles.",
    type: "website",
    url: "https://paprikaa.netlify.app/",
    images: [{ url: "/splash.png", width: 320, height: 568, alt: "Paprika Logo" }],
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
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
      <body className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <InstallPrompt />
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
