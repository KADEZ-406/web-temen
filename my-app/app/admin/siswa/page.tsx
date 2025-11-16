'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { User } from "@/lib/types/database";

export default function DaftarSiswaPage() {
  const [siswa, setSiswa] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin' || parsedUser.role === 'super_admin') {
        fetchSiswa();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
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

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Akses ditolak. Hanya admin yang dapat mengakses halaman ini.</p>
          <Link href="/login/admin" className="text-blue-400 hover:underline">
            Login sebagai Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Daftar Siswa</div>
                <div className="text-xs text-gray-400">SMK Taruna Bhakti</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Daftar Siswa
            </h1>
            <p className="text-gray-400">
              Kelola data siswa SMK Taruna Bhakti
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-700">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Cari Siswa
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama, NISN, atau email..."
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Filter Kelas
                </label>
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white"
                >
                  <option value="">Semua Kelas</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Filter Jurusan
                </label>
                <select
                  value={filterJurusan}
                  onChange={(e) => setFilterJurusan(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white"
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
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-400">Memuat data...</p>
              </div>
            ) : siswa.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">Tidak ada data siswa</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">NISN</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nama Lengkap</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Kelas</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Jurusan</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {siswa.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-gray-300">{s.nisn || '-'}</td>
                        <td className="px-6 py-4 text-white font-medium">{s.nama_lengkap}</td>
                        <td className="px-6 py-4 text-gray-300">{s.kelas || '-'}</td>
                        <td className="px-6 py-4 text-gray-300">{s.jurusan || '-'}</td>
                        <td className="px-6 py-4 text-gray-300">{s.email || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            s.is_active ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
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

          {/* Stats */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            Total: {siswa.length} siswa
          </div>
        </div>
      </div>
    </div>
  );
}

