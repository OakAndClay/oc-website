import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className= "bg-gray-900 bg-[url('/img/OakClay-Vector.svg')] bg-no-repeat bg-[center_170px] bg-fixed bg-[length:40vw] min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white flex items-center justify-left p-2 shadow-gray-700 shadow-2xl">
          <img 
            className="w-24 h-24 mr-4 ml-4"
            src="/img/PNG Logo B Black.png"
            alt="Company Logo"
          />
          <div>
            <h1 className="text-center font-cinzel text-6xl font-bold">Oak and Clay</h1>
            <p className="text-center font-roboto text-xl">Timber Frame Kits and Custom Craftsmanship</p>
          </div>
        </header>
        <main className="flex flex-col items-center justify-center min-h-screen">
        {children}
        </main>
        <footer className="bg-white flex items-center justify-center p-6 shadow-2xl">
          <p className="text-center font-roboto">© 2025 Oak and Clay. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}