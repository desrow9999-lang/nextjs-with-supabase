import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'タスカル - ワンタップ体調記録',
  description: 'うつ病患者向け体調管理PWAアプリ',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
