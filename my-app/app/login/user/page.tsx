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
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/home');
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan saat login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                alt="Logo SMK Taruna Bhakti"
                width={64}
                height={64}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Login Siswa</h1>
          <p className="text-[#778873]/70">Masuk sebagai siswa untuk mengakses layanan BK</p>
        </div>

        <div className="bg-white border border-[#A1BC98] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="nisn" className="block text-sm font-medium text-[#778873] mb-2">
                NISN
              </label>
              <input
                type="text"
                id="nisn"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                required
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                placeholder="Masukkan NISN Anda"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#778873] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#778873]/70 mb-2">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#778873] hover:underline font-medium">
              Daftar di sini
            </Link>
          </p>
          <Link href="/" className="text-sm text-[#778873]/70 hover:text-[#778873]">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
