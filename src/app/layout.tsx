import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SponsorBanner } from "@/components/SponsorBanner";
import { FeedbackWidget } from "@/components/FeedbackWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI 快審通 ADCheck.ai | 3 秒偵測廣告違規，讓罰單與你無緣",
  description: "專為美業、KOL、保健品銷售打造的 AI 廣告法規審核工具。3 秒偵測違規文案，提供合規修改建議，避免 4~400 萬罰款風險。",
  keywords: ["AI快審通", "ADCheck", "廣告審核", "法規檢查", "保健食品", "化妝品", "醫美", "KOL", "美業", "台灣"],
  authors: [{ name: "AI 快審通 ADCheck.ai" }],
  openGraph: {
    title: "AI 快審通 ADCheck.ai",
    description: "3 秒偵測廣告違規，讓罰單與你無緣",
    type: "website",
    locale: "zh_TW",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" data-theme="light">
      <body className={inter.variable}>
        {children}
        <SponsorBanner />
        <FeedbackWidget />
      </body>
    </html>
  );
}
