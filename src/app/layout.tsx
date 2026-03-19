import type { Metadata } from "next";
import "./globals.css";
import { SponsorBanner } from "@/components/SponsorBanner";
import { FeedbackWidget } from "@/components/FeedbackWidget";

export const metadata: Metadata = {
  title: "AI 快審通 | 3 秒偵測廣告違規，讓罰單與你無緣",
  description: "適合創作者、商家與消費者的 AI 廣告風險檢查工具。3 秒判斷商品頁、社群貼文與私訊話術是否有誇大或違規風險，並提供修正與申訴方向。",
  keywords: ["AI快審通", "廣告審核", "法規檢查", "不實廣告", "消費者申訴", "保健食品", "化妝品", "KOL", "台灣"],
  authors: [{ name: "AI 快審通" }],
  openGraph: {
    title: "AI 快審通",
    description: "3 秒判斷廣告有沒有誇大風險，發布前與下單前都能用",
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
      <body>
        {children}
        <SponsorBanner />
        <FeedbackWidget />
      </body>
    </html>
  );
}
