'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80  backdrop-blur-md border-b border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image
                src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                alt="Logo SMK Taruna Bhakti"
                width={48}
                height={48}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white transition-colors duration-300">
                BIMBINGAN KONSELING
              </div>
              <div className="text-xs text-gray-400 transition-colors duration-300">
                SMK TARUNA BHAKTI
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-900/20 transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/home"
              className="px-4 py-2 rounded-lg text-blue-400 font-semibold bg-blue-900/30 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-900/20 transition-all duration-200 font-medium"
            >
              Profile
            </Link>
            <div className="ml-2 pl-2 border-l border-gray-600 ">
              
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-900/20 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/home"
              className="block px-4 py-2 rounded-lg text-blue-400 font-semibold bg-blue-900/30 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-900/20 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}





