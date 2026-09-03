import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watership | Financial Consultant Platform",
  description: "Financial Consultant Platform",
  icons: {
    icon: "/fav.jpg",
    shortcut: "/fav.jpg",
    apple: "/fav.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={`${poppins.className} h-full antialiased`} >
      <head>
        <link rel="icon" href="/fav.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/fav.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/fav.jpg" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
