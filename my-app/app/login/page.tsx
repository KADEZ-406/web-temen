'use client';

import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          
        </div>

        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
              alt="Logo SMK Taruna Bhakti"
              width={80}
              height={80}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">
            Login Bimbingan Konseling
          </h1>
          <p className="text-gray-400 ">Pilih jenis akun untuk masuk</p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Login Siswa */}
          <Link
            href="/login/user"
            className="group bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-600 transition-colors">
                Login Siswa
              </h3>
              <p className="text-gray-400 text-sm">
                Masuk sebagai siswa untuk mengakses layanan BK
              </p>
            </div>
          </Link>

          {/* Login Guru BK */}
          <Link
            href="/login/guru"
            className="group bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-600 transition-colors">
                Login Guru BK
              </h3>
              <p className="text-gray-400 text-sm">
                Masuk sebagai guru BK untuk mengelola konseling
              </p>
            </div>
          </Link>

          {/* Login Admin */}
          <Link
            href="/login/admin"
            className="group bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-600 transition-colors">
                Login Admin
              </h3>
              <p className="text-gray-400 text-sm">
                Masuk sebagai admin untuk mengelola sistem
              </p>
            </div>
          </Link>

          {/* Login Super Admin */}
          <Link
            href="/login/super_admin"
            className="group bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-600 transition-colors">
                Login Super Admin
              </h3>
              <p className="text-gray-400 text-sm">
                Masuk sebagai super admin untuk akses penuh
              </p>
            </div>
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-blue-600  transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}




