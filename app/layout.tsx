import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from '@/componens/TopBar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Настраиваем метаданные здесь 🏰
export const metadata: Metadata = {
  title: "The abyss game",
  description: "Интерактивный помощник для настольной игры",
  icons: {
    icon: "./icon/icon.ico",    
    apple: "./icon/icon.ico",
  },

  // Добавлены только эти блоки для красивого отображения ссылки в Telegram 🏷️
  openGraph: {
    title: "The abyss game",
    description: "Интерактивный помощник для настольной игры",
    url: "https://abyss-sage-iota.vercel.app", // Ссылка на ваш сайт
    siteName: "The abyss game",
    type: "website",
    images: [
      {
        url: "./icon/icon.ico", // Используем ту же иконку для превью ссылки
        width: 512,
        height: 512,
        alt: "The abyss game logo",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "The abyss game",
    description: "Интерактивный помощник для настольной игры",
    images: ["./icon/icon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru" // Изменили язык на русский для корректного SEO 🇷🇺
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-900 text-white flex flex-col pt-16"> 
        {/* pt-16 компенсирует высоту фиксированного TopBar (h-16), чтобы контент не перекрывался */}
        <TopBar/>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}