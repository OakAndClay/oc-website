import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Oak and Clay | Timber Frame Kits and Custom Craftsmanship</title>
        <meta name="description" content="Oak and Clay offers timber frame kits and custom craftsmanship for saunas, pavilions, sheds, cottages, and barns. Timeless quality for your backyard retreat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Oak and Clay" />
        <meta property="og:description" content="Timber Frame Kits and Custom Craftsmanship" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/img/PNG-Logo-B-Black.png" />
        <meta property="og:url" content="https://www.oakandclay.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-800 bg-image-container">
        <header className="sticky top-0 z-50 bg-white flex items-center justify-left p-2 shadow-gray-900 shadow-2xl mb-30">
          <img 
            className="w-24 h-24 mr-4 ml-4"
            src="/img/PNG-Logo-B-Black.png"
            alt="Company Logo"
          />
          <div>
            <h1 className="text-center font-cinzel text-6xl font-bold">Oak and Clay</h1>
            <p className="text-center font-roboto text-xl">Timber Frame Kits and Custom Craftsmanship</p>
          </div>
        </header>
        <main className="flex flex-col items-center min-h-screen">
          {children}
        </main>
        <footer className="bg-white flex items-center justify-center p-6 shadow-2xl mt-20">
          <p className="text-center font-roboto">© 2025 Oak and Clay. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}