'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import type { User } from "@/lib/types";

export default function DaftarSiswaPage() {
  const [siswa, setSiswa] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        fetchSiswa();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchSiswa();
    }
  }, [searchTerm, filterKelas, filterJurusan]);

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      let url = '/api/siswa?';
      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}`;
      } else {
        if (filterKelas) url += `kelas=${encodeURIComponent(filterKelas)}`;
        if (filterJurusan) url += `&jurusan=${encodeURIComponent(filterJurusan)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        setSiswa(data.data);
      }
    } catch (error) {
      console.error('Error fetching siswa:', error);
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
                Daftar Siswa
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
            <h1 className="text-3xl font-bold text-[#778873] mb-2">Daftar Siswa</h1>
            <p className="text-[#778873]/70">Kelola data siswa SMK Taruna Bhakti</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded font-medium transition-colors"
          >
            Tambah Siswa
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-[#A1BC98] rounded p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">Cari Siswa</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, NISN, atau email..."
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">Filter Kelas</label>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              >
                <option value="">Semua Kelas</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">Filter Jurusan</label>
              <select
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              >
                <option value="">Semua Jurusan</option>
                <option value="Teknik Informatika">Teknik Informatika</option>
                <option value="Akuntansi">Akuntansi</option>
                <option value="Teknik Mesin">Teknik Mesin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#A1BC98] rounded overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
              <p className="mt-4 text-[#778873]/70">Memuat data...</p>
            </div>
          ) : siswa.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#778873]/70">Tidak ada data siswa</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F3E0] border-b border-[#A1BC98]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">NISN</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Nama Lengkap</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Kelas</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Jurusan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D2DCB6]">
                  {siswa.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F1F3E0]">
                      <td className="px-6 py-4 text-[#778873]/70">{s.nisn || '-'}</td>
                      <td className="px-6 py-4 font-medium text-[#778873]">{s.nama_lengkap}</td>
                      <td className="px-6 py-4 text-[#778873]/70">{s.kelas || '-'}</td>
                      <td className="px-6 py-4 text-[#778873]/70">{s.jurusan || '-'}</td>
                      <td className="px-6 py-4 text-[#778873]/70">{s.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                          s.is_active ? 'bg-[#D2DCB6] text-[#778873]' : 'bg-[#D2DCB6] text-[#778873]'
                        }`}>
                          {s.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Siswa */}
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
              <h2 className="text-2xl font-bold text-[#778873]">Tambah Siswa Baru</h2>
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
                const response = await fetch('/api/siswa', {
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
                  toast.success('Siswa berhasil ditambahkan!');
                  setIsAddModalOpen(false);
                  setFormData({
                    username: '',
                    password: '',
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
                  fetchSiswa();
                } else {
                  toast.error(data.message || 'Gagal menambahkan siswa');
                }
              } catch (error) {
                console.error('Error adding siswa:', error);
                toast.error('Terjadi kesalahan saat menambahkan siswa');
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
                  <label className="block text-sm font-medium text-[#778873] mb-2">NISN</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Masukkan NISN"
                  />
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
                  <label className="block text-sm font-medium text-[#778873] mb-2">Jenis Kelamin</label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
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
                  <label className="block text-sm font-medium text-[#778873] mb-2">Kelas</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="X">X</option>
                    <option value="XI">XI</option>
                    <option value="XII">XII</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">Jurusan</label>
                  <select
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  >
                    <option value="">Pilih Jurusan</option>
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Akuntansi">Akuntansi</option>
                    <option value="Teknik Mesin">Teknik Mesin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#778873] mb-2">Tahun Masuk</label>
                  <input
                    type="number"
                    value={formData.tahun_masuk}
                    onChange={(e) => setFormData({ ...formData, tahun_masuk: e.target.value })}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    placeholder="Contoh: 2022"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#778873] mb-2">Alamat</label>
                  <textarea
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none resize-none"
                    placeholder="Masukkan alamat"
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
                  {isSubmitting ? 'Menambahkan...' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
