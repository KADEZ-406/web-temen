'use client';

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-[#A1BC98] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
              <div className="text-sm font-semibold text-[#778873]">
                BK SMK Taruna Bhakti
              </div>
            </div>
            
            <Link
              href="/login"
              className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#778873] mb-6">
          Bimbingan Konseling
        </h1>
        <p className="text-xl text-[#778873]/70 mb-12 max-w-2xl mx-auto">
          Layanan bimbingan dan konseling untuk mendukung perkembangan akademik, karir, dan pribadi siswa SMK Taruna Bhakti.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-[#778873] text-white rounded hover:bg-[#778873]/90 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors"
          >
            Daftar
          </Link>
        </div>
      </section>

      <section className="bg-[#F1F3E0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#778873] mb-12 text-center">
            Layanan Bimbingan Konseling
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#A1BC98] rounded">
              <div className="w-12 h-12 bg-[#778873] rounded mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#778873] mb-3">Konseling Akademik</h3>
              <p className="text-[#778873]/70">
                Bimbingan untuk meningkatkan prestasi belajar dan mengatasi kesulitan belajar.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#A1BC98] rounded">
              <div className="w-12 h-12 bg-[#778873] rounded mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#778873] mb-3">Konseling Karir</h3>
              <p className="text-[#778873]/70">
                Bimbingan untuk mengenali minat dan bakat serta merencanakan karir.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#A1BC98] rounded">
              <div className="w-12 h-12 bg-[#778873] rounded mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#778873] mb-3">Konseling Pribadi</h3>
              <p className="text-[#778873]/70">
                Bimbingan untuk mengembangkan kepribadian dan mengatasi masalah pribadi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#778873] text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm opacity-90">
            © {new Date().getFullYear()} SMK Taruna Bhakti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
