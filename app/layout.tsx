import type { Metadata } from "next";
import { Geist, Geist_Mono, Teko } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import FeedbackWidget from "@/components/FeedbackWidget";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-teko",
  weight: ["600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radar do Tatame — Campeonatos de Jiu-Jitsu",
  description: "Encontre campeonatos de Jiu-Jitsu de todas as federações em um só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${teko.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-30">
            <div className="bg-belt-black/90 text-white backdrop-blur-md">
              <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
                <Link
                  href="/"
                  className="flex shrink-0 items-center gap-1.5 font-display text-2xl sm:text-4xl font-bold uppercase tracking-wide leading-none transition hover:opacity-80"
                >
                  🥋 Radar do Tatame
                </Link>
                <div className="flex items-center gap-2 sm:gap-4">
                  <nav className="flex gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-neutral-300">
                    <Link href="/" className="relative py-1 transition hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:scale-x-0 after:bg-belt-blue after:transition-transform hover:after:scale-x-100">
                      Campeonatos
                    </Link>
                    <Link href="/admin" className="relative py-1 transition hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:scale-x-0 after:bg-belt-blue after:transition-transform hover:after:scale-x-100">
                      Admin
                    </Link>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </div>
            <div className="belt-stripe" />
          </header>
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
          <SiteFooter />
          <FeedbackWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
