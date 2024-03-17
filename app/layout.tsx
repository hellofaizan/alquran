import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from "@/components/ui/sonner"
import Nav from '@/components/navbar';
import Image from 'next/image';
import gradientImg from "@/public/topimg.png";
import localfont from '@next/font/local'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  metadataBase: new URL('https://hellofaizan.tech'),
  title: {
    default: 'HelloFaizan',
    template: '%s | HelloFaizan',
  },
  description: 'I build Internet products.',
  openGraph: {
    title: 'HelloFaizan',
    description: 'I build Internet products.',
    url: 'https://hellofaizan.tech',
    siteName: 'HelloFaizan',
    locale: 'en_US',
    type: 'website',
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
      <body className={`${inter.className} ${arabic.className} ${uthmanic.variable}`}>
        <Image src={gradientImg} alt="background" className="absolute z-[-1] left-0 w-full h-1/2 md:h-2/3 object-cover" role="progressbar" priority />
        <div className='flex-auto min-w-0 flex px-0 flex-col container max-w-3xl mx-auto min-h-screen md:pt-16'>
          <Nav />
          <div className='flex-1 px-4'>
            {children}
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
