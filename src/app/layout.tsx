import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ExplifyAI — CS concepts in 60 seconds',
  description: 'Tanglish videos that explain DSA and CS from zero. Join the waitlist.',
  metadataBase: new URL('https://explifyai.com'), // Replace with actual URL when known
  openGraph: {
    title: 'ExplifyAI — CS concepts in 60 seconds',
    description: 'Tanglish videos that explain DSA and CS from zero. Join the waitlist.',
    type: 'website',
    url: 'https://explifyai.com',
    siteName: 'ExplifyAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ExplifyAI — CS concepts in 60 seconds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExplifyAI — CS concepts in 60 seconds',
    description: 'Tanglish videos that explain DSA and CS from zero. Join the waitlist.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-[#0a0a0a] text-[#ffffff] antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
