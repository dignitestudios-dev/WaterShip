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
  title: "Waterhip | Financial Consultant Platform",
  description: "Financial Consultant Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={`${poppins.className} h-full antialiased`} >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <QueryProvider>
          {children}
      
        </QueryProvider>
      </body>
    </html>
  );
}
