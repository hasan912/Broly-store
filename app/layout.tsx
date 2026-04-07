import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSerif = Noto_Serif({ subsets: ['latin'], weight: ['300', '400', '600'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Atelier Monolith | Immersive Headwear',
  description: 'A revolutionary, immersive 3D gallery for premium e-commerce headwear.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSerif.variable} font-sans antialiased bg-background`}>
        <CartProvider>
          <Navbar />
          {/* Main 3D Space & UI Overlays are rendered by children */}
          <main className="relative w-full h-full min-h-screen">
            {children}
          </main>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#000000',
                color: '#e5e2e1',
                borderRadius: '0px',
                border: '1px solid rgba(198,198,198,0.15)',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
