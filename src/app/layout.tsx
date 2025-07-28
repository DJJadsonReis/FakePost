import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'
import { AdBlockDetector } from '@/components/ad-block-detector';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'FakePost - Gerador de Posts Falsos para Redes Sociais',
  description: 'Crie posts falsos realistas para redes sociais com comentários gerados por IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="font-sans antialiased h-full">
        <AdBlockDetector>
          {children}
        </AdBlockDetector>
        <Toaster />
      </body>
    </html>
  );
}
