'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    nisn: '',
    nama_lengkap: '',
    jenis_kelamin: '',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: '',
    kelas: '',
    jurusan: '',
    tahun_masuk: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email || null,
          nisn: formData.nisn || null,
          nama_lengkap: formData.nama_lengkap,
          jenis_kelamin: formData.jenis_kelamin || null,
          tanggal_lahir: formData.tanggal_lahir || null,
          alamat: formData.alamat || null,
          no_telepon: formData.no_telepon || null,
          kelas: formData.kelas || null,
          jurusan: formData.jurusan || null,
          tahun_masuk: formData.tahun_masuk || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registrasi berhasil! Silakan login.');
        router.push('/login');
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan saat registrasi');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
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
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Registrasi Siswa</h1>
          <p className="text-[#778873]/70">Daftar akun baru untuk mengakses layanan BK</p>
        </div>

        <div className="bg-white border border-[#A1BC98] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#778873] mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label htmlFor="nisn" className="block text-sm font-medium text-[#778873] mb-2">
                  NISN
                </label>
                <input
                  type="text"
                  id="nisn"
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="Masukkan NISN"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nama_lengkap" className="block text-sm font-medium text-[#778873] mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama_lengkap"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#778873] mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#778873] mb-2">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="Ulangi password"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#778873] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label htmlFor="no_telepon" className="block text-sm font-medium text-[#778873] mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  id="no_telepon"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-[#778873] mb-2">
                  Jenis Kelamin
                </label>
                <select
                  id="jenis_kelamin"
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                >
                  <option value="">Pilih...</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label htmlFor="kelas" className="block text-sm font-medium text-[#778873] mb-2">
                  Kelas
                </label>
                <input
                  type="text"
                  id="kelas"
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="X, XI, XII"
                />
              </div>

              <div>
                <label htmlFor="jurusan" className="block text-sm font-medium text-[#778873] mb-2">
                  Jurusan
                </label>
                <input
                  type="text"
                  id="jurusan"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="RPL, TKJ, dll"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-[#778873] mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  id="tanggal_lahir"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>

              <div>
                <label htmlFor="tahun_masuk" className="block text-sm font-medium text-[#778873] mb-2">
                  Tahun Masuk
                </label>
                <input
                  type="number"
                  id="tahun_masuk"
                  name="tahun_masuk"
                  value={formData.tahun_masuk}
                  onChange={handleChange}
                  min="2020"
                  max="2030"
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="2023"
                />
              </div>
            </div>

            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-[#778873] mb-2">
                Alamat
              </label>
              <textarea
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none resize-none"
                placeholder="Masukkan alamat"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[#778873] hover:bg-[#778873]/90 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#778873]/70">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#778873] hover:underline font-medium">
              Login di sini
            </Link>
          </p>
          <Link href="/" className="text-sm text-[#778873]/70 hover:text-[#778873] block mt-2">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

