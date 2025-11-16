'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuruLoginPage() {
  const [email, setEmail] = useState('');
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
          username: email,
          password: password,
          role: 'guru',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Simpan user data ke localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect ke dashboard guru
        router.push('/guru/dashboard');
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
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent mb-2">
            Login Guru BK
          </h1>
          <p className="text-gray-400">Masuk sebagai guru BK untuk mengelola konseling</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Masuk ke Akun Guru BK</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-900 text-white placeholder-gray-400"
                placeholder="Masukkan email Anda"
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
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-900 text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500 bg-gray-900"
                />
                <span className="ml-2 text-sm text-gray-400">Ingat saya</span>
              </label>
              <Link href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk sebagai Guru BK'}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 font-medium">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

