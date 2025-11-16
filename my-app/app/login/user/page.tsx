'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLoginPage() {
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: nisn,
          password: password,
          role: 'siswa',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Simpan user data ke localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect ke home
        router.push('/home');
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan saat login. Pastikan database sudah terhubung.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwmtMlJl_cZDFJKXP6TlQ3BKtxaceL1YGDvr3vToK0vwFjRjYCm1vSBrwYU06ISxE9jOqVAgr0LCHYnA_WLUVSaySoG4y8DLNuLLZMLm2E_XF6vQgFJQtSD_zwTOpyXolHGmxsclQ=s1360-w1360-h1020-rw"
          alt="Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gray-900/50  backdrop-blur-sm"></div>
      </div>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">
            Login Siswa
          </h1>
          <p className="text-gray-400 ">Masuk sebagai siswa untuk mengakses layanan BK</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-blue-200 ">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Masuk ke Akun Siswa</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50  border border-red-200  text-red-700  px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="nisn" className="block text-sm font-semibold text-gray-300 mb-2">
                NISN
              </label>
              <input
                type="text"
                id="nisn"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-blue-200  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white placeholder-gray-400"
                placeholder="Masukkan NISN Anda"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-blue-200  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-blue-300  rounded focus:ring-blue-500 bg-gray-900 "
                />
                <span className="ml-2 text-sm text-gray-400 ">Ingat saya</span>
              </label>
              <Link href="#" className="text-sm text-blue-600  hover:text-blue-700  font-medium">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk sebagai Siswa'}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-blue-600  font-medium">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}


