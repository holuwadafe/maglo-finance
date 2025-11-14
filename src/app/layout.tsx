import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maglo - Finance Management Dashboard",
  description: "Manage invoices and track financial summaries for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
            {/* Global theme toggle (visible on every page) */}
            <div className="fixed top-4 right-4 z-50 hidden sm:block">
              <ThemeToggle />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

