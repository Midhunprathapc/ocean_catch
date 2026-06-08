import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Salmons - Definitely Fresh | Premium Seafood Delivery",
  description: "Fresh seafood delivered to your doorstep. Premium quality fish, prawns, crabs and more.",
  icons: {
    icon: "/logo.svg",
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
        className={`${inter.variable} antialiased bg-white text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
