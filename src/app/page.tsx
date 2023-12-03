import { Metadata } from 'next'
import { THEME_COLORS } from '@/const/theme'
import HomePageClient from './page-client'

export const metadata: Metadata = {
  title: "Password encrypted data",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.png" },
    { rel: "apple-touch-icon", url: "/icons/sizes/square/192.png", sizes: "192x192" },
    { rel: "apple-touch-startup-image", url: "/icons/sizes/square/512.png" }
  ],
  themeColor: [{ color: THEME_COLORS.primary, media: "(prefers-color-scheme: light)" }, { color: THEME_COLORS.primary_dark, media: "(prefers-color-scheme: dark)" }]
}

export default function DashboardPage() {
  return <HomePageClient />
}