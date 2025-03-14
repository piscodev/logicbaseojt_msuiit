import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
// import FooterComp from "./components/Footer";
import { ConfigProvider } from "antd";
// import Nav from "./components/NavigationBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MoneyCacheHub",
  description: "A Next.js web application designed to track MoneyCache POS shift transaction records.",
  icons: {
    icon: "/LogoIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider>
            {/* <Nav /> */}
            {children}
            {/* <FooterComp /> */}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}