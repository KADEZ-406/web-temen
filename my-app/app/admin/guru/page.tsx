'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import type { GuruBK } from "@/lib/types";

export default function DaftarGuruPage() {
  const [guru, setGuru] = useState<GuruBK[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nip: '',
    nama_lengkap: '',
    jenis_kelamin: '',
    no_telepon: '',
    spesialisasi: '',
    pendidikan_terakhir: '',
    tahun_mulai_mengajar: '',
    bio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        fetchGuru();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchGuru = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data) {
        setGuru(data.data);
      }
    } catch (error) {
      console.error('Error fetching guru:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#778873]/70 mb-4">Akses ditolak. Hanya admin yang dapat mengakses halaman ini.</p>
          <Link href="/login" className="text-[#778873] hover:underline">
            Login sebagai Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navbar */}
      <nav className="border-b border-[#A1BC98] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="text-sm font-semibold text-[#778873]">
                Daftar Guru BK
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-[#778873] hover:text-[#778873]"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#778873] mb-2">Daftar Guru BK</h1>
            <p className="text-[#778873]/70">Kelola data guru Bimbingan Konseling</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded font-medium transition-colors"
          >
            Tambah Guru
          </button>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
            <p className="mt-4 text-[#778873]/70">Memuat data...</p>
          </div>
        ) : guru.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#778873]/70">Tidak ada data guru BK</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guru.map((g) => (
              <div
                key={g.id}
                className="bg-white border border-[#A1BC98] rounded p-6 hover:border-[#778873] transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#778873] shrink-0">
                    <Image
                      src={g.foto_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(g.nama_lengkap)}&size=200&background=2563eb&color=fff`}
                      alt={g.nama_lengkap}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#778873] mb-1">{g.nama_lengkap}</h3>
                    <p className="text-sm text-[#778873]/70 mb-2">{g.spesialisasi || 'Bimbingan Konseling'}</p>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      g.is_active ? 'bg-[#D2DCB6] text-[#778873]' : 'bg-[#D2DCB6] text-[#778873]'
                    }`}>
                      {g.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#778873]/70">
                  {g.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{g.email}</span>
                    </div>
                  )}
                  {g.no_telepon && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{g.no_telepon}</span>
                    </div>
                  )}
                  {g.pendidikan_terakhir && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      <span>{g.pendidikan_terakhir}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Guru */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-[#778873]/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-3xl w-full border border-[#A1BC98] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#778873]">Tambah Guru BK Baru</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#778873]/70 hover:text-[#778873]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                const response = await fetch('/api/guru', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ...formData,
                    current_user_id: user?.id,
                    current_user_role: user?.role,
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  toast.success('Guru berhasil ditambahkan!');
                  setIsAddModalOpen(false);
                  setFormData({
                    username: '',
                    password: '',
                    email: '',
                    nip: '',
                    nama_lengkap: '',
                    jenis_kelamin: '',
                    no_telepon: '',
                    spesialisasi: '',
                    pendidikan_terakhir: '',
                    tahun_mulai_mengajar: '',
                    bio: '',
                  });
                  fetchGuru();
                } else {
                  toast.error(data.message || 'Gagal menambahkan guru');
                }
              } catch (error) {
                console.error('Error adding guru:', error);
                toast.error('Terjadi kesalahan saat menambahkan guru');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Masukkan username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Masukkan password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Masukkan email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">NIP</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Masukkan NIP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">No. Telepon</label>
                  <input
                    type="tel"
                    value={formData.no_telepon}
                    onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Masukkan no. telepon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">Spesialisasi</label>
                  <input
                    type="text"
                    value={formData.spesialisasi}
                    onChange={(e) => setFormData({ ...formData, spesialisasi: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Contoh: Konseling Akademik & Karir"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={formData.pendidikan_terakhir}
                    onChange={(e) => setFormData({ ...formData, pendidikan_terakhir: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Contoh: S1 Pendidikan Bimbingan Konseling"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">Tahun Mulai Mengajar</label>
                  <input
                    type="number"
                    value={formData.tahun_mulai_mengajar}
                    onChange={(e) => setFormData({ ...formData, tahun_mulai_mengajar: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Contoh: 2015"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#778873] mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none resize-none"
                    placeholder="Masukkan bio atau deskripsi"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menambahkan...' : 'Tambah Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
