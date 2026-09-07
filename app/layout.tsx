import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "見てわかるハイドロリリース｜長野市三輪 上野医院",
  description: "整形外科専門医が打つハイドロリリース。首・肩・腰の症状から、筋肉の層と注射前後の作用イメージを確認できます。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
