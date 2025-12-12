import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-space',
  display: 'swap',
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-tech',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AstroDoc - Astronaut Health Tracker",
  description: "Mission-Critical Health Monitoring & Parallel Timeline Simulations for Space Explorers",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${orbitron.variable} ${rajdhani.variable}`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          {children}
          <Toaster />
        </ClerkProvider>
        <Footer />
      </body>
    </html>
  );
}
