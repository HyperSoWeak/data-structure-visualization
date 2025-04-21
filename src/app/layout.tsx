import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Data Structure Visualizer",
  description: "Visualize various data structures and algorithms, created by HyperSoWeak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className="text-white bg-gray-800 flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow flex justify-center items-center text-white bg-gray-800">{children}</div>
          <Footer />
        </body>
      </html>
    </>
  );
}
