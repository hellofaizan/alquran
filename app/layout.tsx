import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from "@/components/ui/sonner"
import Nav from '@/components/navbar';
import Image from 'next/image';
import gradientImg from "@/public/topimg.png";
import localfont from 'next/font/local'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  metadataBase: new URL('https://alquran.mohammadfaizan.in'),
  title: {
    default: 'Al Quran Kareen',
    template: '%s | Mohammad Faizan',
  },
  description: 'Free Open Source Quran App with Englsih and Urdu translations',
  openGraph: {
    title: 'Al Quran Kareen',
    description: 'Free Open Source Quran App with Englsih and Urdu translations',
    url: 'https://mohammadfaizan.in',
    siteName: 'Al Quran',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://alquran.mohammadfaizan.in/assets/islam.jpg',
        alt: 'HelloFaizan',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'HelloFaizan',
    card: 'summary_large_image',
    site: '@hellofaizaan',
    creator: '@hellofaizaan',

  },
  // verification: {
  //   google: 'eZSdmzAXlLkKhNJzfgwDqWORghxnJ8qR9_CHdAh5-xw',
  //   yandex: '14d2e73487fa6c71',
  // },
};

const inter = Inter({ subsets: ['latin'] })
const uthmanic = localfont({
  src: '../public/fonts/Uthman.otf',
  display: 'swap',
  variable: "--font-uthmanic",
})
const arabic = localfont({
  src: '../public/fonts/Arabic.ttf',
  display: 'swap',
  variable: "--font-arabic",
})

const cx = (...classes: any) => classes.filter(Boolean).join(' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cx(
      'text-white bg-[#111010]',
      GeistSans.variable,
      GeistMono.variable
    )}>
      <body className={`${inter.className} ${uthmanic.variable}`}>
        {/* <Nav /> */}
        <div className='flex-1 min-h-screen w-full bg-[#181818]'>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
