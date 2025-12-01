import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import Header from "./components/header/Header";

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
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
