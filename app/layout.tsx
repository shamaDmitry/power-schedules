import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Графіки відключення електроенергії в Запоріжжі",
    template: "%s | Відключення світла Запоріжжя",
  },
  description:
    "Актуальні графіки відключення електроенергії в Запоріжжі. Дізнайтесь коли буде світло у вашому районі. Погодинний розклад відключень для всіх груп.",
  keywords: [
    "відключення світла",
    "графік відключення електроенергії",
    "Запоріжжя",
    "відключення електрики",
    "розклад відключень",
    "коли буде світло",
    "ДТЕК",
    "Запоріжжяобленерго",
    "погодинні відключення",
    "аварійні відключення",
  ],
  authors: [{ name: "Power Schedules" }],
  creator: "Power Schedules",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "Графіки відключення світла - Запоріжжя",
    title: "Графіки відключення електроенергії в Запоріжжі",
    description:
      "Актуальні графіки відключення електроенергії в Запоріжжі. Дізнайтесь коли буде світло у вашому районі.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Графіки відключення електроенергії в Запоріжжі",
    description:
      "Актуальні графіки відключення електроенергії в Запоріжжі. Дізнайтесь коли буде світло у вашому районі.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen w-full bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Header />

          <main className="flex-1">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
