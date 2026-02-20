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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cottage', label: 'Kits' },
    { href: '/custom-craft', label: 'Custom Craft' },
    { href: '/about-us', label: 'About Us' },
    { href: '/timber-terminology', label: 'Terminology' },
  ];

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
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 lg:h-24">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                <img
                  className="w-16 h-16 lg:w-20 lg:h-20"
                  src="/img/PNG-Logo-B-Black.png"
                  alt="Company Logo"
                />
                <div className="hidden sm:block">
                  <h1 className="font-cinzel text-2xl lg:text-3xl font-bold text-stone-800">Oak and Clay</h1>
                  <p className="font-roboto text-sm lg:text-base text-stone-600 hidden md:block">Timber Frame Kits and Custom Craftsmanship</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-roboto text-stone-700 hover:text-stone-900 font-medium transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-800 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Hamburger Button */}
              <div className="lg:hidden relative">
                <button
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
                  aria-label="Open menu"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <svg
                    className="w-7 h-7 text-stone-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    {menuOpen ? (
                      <>
                        <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                        <line x1="6" y1="18" x2="18" y2="6" strokeLinecap="round" />
                      </>
                    ) : (
                      <>
                        <line x1="5" y1="7" x2="19" y2="7" strokeLinecap="round" />
                        <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                        <line x1="5" y1="17" x2="19" y2="17" strokeLinecap="round" />
                      </>
                    )}
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl border border-stone-200 z-50 rounded-lg overflow-hidden">
                    <ul className="py-2">
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block px-4 py-3 hover:bg-stone-100 font-roboto text-stone-700 transition-colors"
                            onClick={handleCloseMenu}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section - Only on homepage */}
        <main className="flex flex-col items-center min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-stone-800 text-stone-300 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    className="w-12 h-12"
                    src="/img/PNG-Logo-B-Black.png"
                    alt="Company Logo"
                  />
                  <h3 className="font-cinzel text-xl text-white">Oak and Clay</h3>
                </div>
                <p className="font-roboto text-stone-400 text-sm leading-relaxed">
                  Custom handcrafted timber frames and affordable kits — built with traditional joinery and care.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-cinzel text-lg text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-roboto text-stone-400 hover:text-white transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-cinzel text-lg text-white mb-4">Contact Us</h4>
                <p className="font-roboto text-stone-400 text-sm mb-2">
                  Have questions about our timber frame kits?
                </p>
                <p className="font-roboto text-stone-400 text-sm">
                  Email: craft@oakandclay.com
                </p>
                <p className="font-roboto text-stone-400 text-sm">
                  Phone: (434) 305-2062
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-stone-700 mt-8 pt-8 text-center">
              <p className="font-roboto text-stone-500 text-sm">
                &copy; {new Date().getFullYear()} Oak and Clay LLC. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
