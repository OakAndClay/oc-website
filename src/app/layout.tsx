'use client';

import './globals.css';
import { ReactNode, useState } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close the menu
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

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
      <body className="bg-stone-400 bg-image-container">
        <header className="sticky top-0 z-50 bg-white flex items-center p-2 shadow-gray-900 shadow-2xl mb-30">
          <Link href="/">
            <img 
              className="w-24 h-24 mr-4 ml-4"
              src="/img/PNG-Logo-B-Black.png"
              alt="Company Logo"
            />
          </Link>
          <div>
            <h1 className="text-center font-cinzel text-6xl font-bold">Oak and Clay</h1>
            <p className="text-center font-roboto text-xl">Timber Frame Kits and Custom Craftsmanship</p>
          </div>
          <div className="relative ml-auto mr-4">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Open menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                className="w-7 h-7 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <line x1="5" y1="7" x2="19" y2="7" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                <line x1="5" y1="17" x2="19" y2="17" strokeLinecap="round" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-100 border border-gray-200 shadow-lg z-50">
                <ul className="py-2">
                  <li>
                    <Link 
                      href="/timber-terminology" 
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={handleCloseMenu}
                    >
                      Terminology
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/custom-craft" 
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={handleCloseMenu}
                    >
                      Custom Craft
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about-us" 
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={handleCloseMenu}
                    >
                      About Us
                    </Link>
                  </li>
                  {/* Add more menu items here */}
                </ul>
              </div>
            )}
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