import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryClientProvider from '@/ReactQueryUtils/ReactQueryClientProvider';
import React from 'react';
import Navbar from './components/Navbar/page';
import { GlobalProvider } from '@/app/GlobalProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fussion Bazar',
  description: 'A Market Place for all Products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProvider>
          <Navbar />
          <ReactQueryClientProvider>
            {children}
          </ReactQueryClientProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
