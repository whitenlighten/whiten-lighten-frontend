import AuthGuard from "@/components/shared/auth-guard";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whiten Lighten | Celebrity Dentist",
  description:
    "We’re affordable but we’re not inexpensive with quality service because we run a dental luxury lounge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <AuthGuard>
          <body
            className={`${geistSans.className} ${geistMono.variable} scroll-smooth antialiased`}>
            <NextTopLoader
              color="#155dfc"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
            />
            {children}
            <Toaster richColors />
          </body>
        </AuthGuard>
      </SessionProvider>
    </html>
  );
}
