import './globals.css';

export const metadata = {
  title: 'タスカル',
  description: 'メンタルサポート＆タスク管理アプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
