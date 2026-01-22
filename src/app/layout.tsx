import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morning Golden Time",
  description: "Transform your morning into golden moments",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Morning Golden Time",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Morning Golden Time",
    title: "Morning Golden Time",
    description: "Transform your morning into golden moments",
  },
  twitter: {
    card: "summary",
    title: "Morning Golden Time",
    description: "Transform your morning into golden moments",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBBF24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
