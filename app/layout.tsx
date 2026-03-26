import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import ThemeProvider from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://referio.io'),
  title: {
    default: 'Referio',
    template: '%s | Referio',
  },
  description:
    'Refer great people to great roles. Get paid when they are hired.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-primary antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
