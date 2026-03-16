import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'R.K. Industries | Precision Engineering',
  description: 'R.K. Industries delivers robust gearbox solutions and custom manufacturing for the world\'s most demanding environments.',
  icons: {
    icon: '/logo3.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await initDB();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 150px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
