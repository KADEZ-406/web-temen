'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#778873] border-b border-[#778873] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
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
              <div className="text-sm font-bold text-white">
                BIMBINGAN KONSELING
              </div>
              <div className="text-xs text-white/80">
                SMK TARUNA BHAKTI
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/home"
              className="px-4 py-2 rounded-lg text-white font-semibold bg-[#778873] hover:bg-[#778873]/90"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-[#778873]/80 font-medium"
            >
              Profile
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-[#778873]/80 transition-colors"
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

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/home"
              className="block px-4 py-2 rounded-lg text-white font-semibold bg-[#778873] hover:bg-[#778873]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-[#778873]"
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





