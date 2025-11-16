'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminLoginPage() {
  const [username, setUsername] = useState('');
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
          username: username,
          password: password,
          role: 'super_admin',
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/admin');
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
            <div className="relative w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent mb-2">
            Login Super Admin
          </h1>
          <p className="text-gray-400 ">Masuk sebagai super admin untuk akses penuh sistem</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-purple-200 ">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Masuk ke Akun Super Admin</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50  border border-red-200  text-red-700  px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
                Username Super Admin
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-purple-200  rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-900 text-white placeholder-gray-400"
                placeholder="Masukkan username super admin"
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
                className="w-full px-4 py-3 border-2 border-purple-200  rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-900 text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 border-purple-300  rounded focus:ring-purple-500 bg-gray-900 "
                />
                <span className="ml-2 text-sm text-gray-400 ">Ingat saya</span>
              </label>
              <Link href="#" className="text-sm text-purple-600  hover:text-purple-700  font-medium">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk sebagai Super Admin'}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-purple-600  font-medium">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
