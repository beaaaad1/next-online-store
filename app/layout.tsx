import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import Header from "./components/header/Header";
import { SessionProvider } from 'next-auth/react';
import AuthProvider from "@/app/components/AuthProvider";

const rubik = Rubik({
	variable: '--font-sans',
	subsets: ['latin', 'cyrillic'],
})



export const metadata: Metadata = {
  title: "Россети-ЭлектроМаркет",
  description: "Магазин электротехники от «Россети»",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} font-sans`}>
        <AuthProvider>
          <Header/>
            <main>
                {children}
            </main>
            <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}

