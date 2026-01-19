import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import Playfair
import "./globals.css";
import AuthProvider from "./AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Sake Recommendation | Premium Selection",
  description: "Discover the finest sake curated just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
