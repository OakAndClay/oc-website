import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <header className="bg-white flex items-center justify-left p-6 shadow-2xl">
          <img 
            className="w-28 h-28 mr-4 ml-4"
            src="/PNG Logo B Black.png"
            alt="Company Logo"
          />
          <div>
            <h1 className="text-center font-cinzel text-6xl font-bold">Oak and Clay</h1>
            <p className="text-center font-roboto text-xl">Timber Frame Kits and Custom Craftsmanship</p>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}