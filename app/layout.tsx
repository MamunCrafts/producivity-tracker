import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Productivity Tracker",
  description:
    "A simple app to track and visualize your productivity over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-black text-white selection:bg-purple-500/30`}
      >
        {/* Ambient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/20 blur-[120px]" />
        </div>

        <main className="flex-1 relative z-10">
          {children}
        </main>
        <footer className="py-8 border-t border-zinc-800 mt-auto relative z-10">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="font-semibold text-zinc-100 text-lg">Md AL Mamun Mim</p>
            <p className="text-zinc-400 text-sm mt-1">
              Senior Software Developer <span className="mx-2 text-zinc-700">|</span> <span className="font-medium text-violet-500">Fanfare</span>
            </p>
            <p className="text-zinc-500 text-xs mt-4">
              &copy; {new Date().getFullYear()} Md AL Mamun Mim. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
