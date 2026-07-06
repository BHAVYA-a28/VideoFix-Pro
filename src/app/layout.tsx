import type { Metadata } from 'next';
import Header from '../components/Header';
import Providers from '../components/Providers';
import '../index.css';

export const metadata: Metadata = {
  title: 'Professional VideoFix Pro',
  description: 'Real-time automated system diagnostics and optimization suite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
