import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아띠 - 당신의 똑똑한 친구",
  description: "감정 일기 + 근거 기반 액션 추천 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
