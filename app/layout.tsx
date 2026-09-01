import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GovSetu â€“ AI-Enabled Governmentâ€“Startup Innovation Platform",
  description:
    "GovSetu bridges the gap between government innovation challenges and startup solutions through structured AI-enabled procurement, sandbox pilots, and transparent evaluation.",
  keywords: ["GovTech", "DPIIT", "Startup India", "Government Procurement", "AI Innovation", "Sandbox Pilot"],
  authors: [{ name: "GovSetu Platform Team" }],
  openGraph: {
    title: "GovSetu â€“ Government Innovation Procurement Platform",
    description: "AI-Enabled Governmentâ€“Startup Innovation Procurement & Sandbox Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-gov-bg font-body text-gov-text antialiased">
        <StoreProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
