import { AuthProvider } from './auth/AuthProvider';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sky Scout',
  description: 'Analyze second-degree Bluesky connections'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="relative">
      <AuthProvider>
        <body className={inter.className}>{children}</body>
      </AuthProvider>
      <div
        className="h-screen w-screen fixed top-0 z-auto"
        style={{
          background: `linear-gradient(45deg,rgb(var(--background-end-rgb)), rgb(var(--background-start-rgb)))`
        }}
      />
    </html>
  );
}
