'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { DashboardSiswa, JadwalKonselingWithRelations } from "@/lib/types";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardSiswa | null>(null);
  const [jadwalMendatang, setJadwalMendatang] = useState<JadwalKonselingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.id);
      fetchJadwalMendatang(parsedUser.id);
    } else {
      setLoading(false);
    }
    
    const interval = setInterval(() => {
      const currentUserData = localStorage.getItem('user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        fetchJadwalMendatang(currentUser.id);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?user_id=${userId}&role=siswa`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setDashboardData(data.data);
      } else {
        setDashboardData({
          siswa_id: userId,
          nama_siswa: user?.nama_lengkap || '',
          total_konseling: 0,
          jadwal_mendatang: 0,
          konseling_selesai: 0,
          konseling_berlangsung: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setDashboardData({
        siswa_id: userId,
        nama_siswa: user?.nama_lengkap || '',
        total_konseling: 0,
        jadwal_mendatang: 0,
        konseling_selesai: 0,
        konseling_berlangsung: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJadwalMendatang = async (userId: number) => {
    try {
      const response = await fetch(`/api/jadwal?siswa_id=${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const upcoming = data.data
          .filter((jadwal: JadwalKonselingWithRelations) => {
            const status = jadwal.status || 'menunggu';
            const validStatuses = ['menunggu', 'dijadwalkan', 'berlangsung'];
            if (!validStatuses.includes(status)) return false;
            
            const jadwalDate = new Date(`${jadwal.tanggal} ${jadwal.waktu_mulai}`);
            return jadwalDate >= new Date();
          })
          .sort((a: JadwalKonselingWithRelations, b: JadwalKonselingWithRelations) => {
            const dateA = new Date(`${a.tanggal} ${a.waktu_mulai}`).getTime();
            const dateB = new Date(`${b.tanggal} ${b.waktu_mulai}`).getTime();
            return dateA - dateB;
          })
          .slice(0, 5);
        
        setJadwalMendatang(upcoming);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'menunggu': 'Menunggu Persetujuan',
      'dijadwalkan': 'Dijadwalkan',
      'berlangsung': 'Berlangsung',
      'selesai': 'Selesai',
      'dibatalkan': 'Dibatalkan'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'menunggu': 'bg-[#D2DCB6] text-[#778873]',
      'dijadwalkan': 'bg-[#D2DCB6] text-[#778873]',
      'berlangsung': 'bg-[#D2DCB6] text-[#778873]',
      'selesai': 'bg-[#D2DCB6] text-[#778873]',
      'dibatalkan': 'bg-[#D2DCB6] text-[#778873]'
    };
    return colors[status] || 'bg-[#D2DCB6] text-[#778873]';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#778873]/70 mb-4">Anda belum login</p>
          <Link href="/login" className="text-[#778873] hover:underline">
            Login terlebih dahulu
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
            <Link href="/" className="flex items-center gap-3">
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
                Dashboard
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/home"
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Dashboard</h1>
          <p className="text-[#778873]/70">Ringkasan aktivitas bimbingan konseling Anda</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
          </div>
        ) : dashboardData ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Total Konseling</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.total_konseling || 0}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Jadwal Mendatang</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.jadwal_mendatang || 0}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Konseling Selesai</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.konseling_selesai || 0}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Berlangsung</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.konseling_berlangsung || 0}</div>
              </div>
            </div>

            {/* Jadwal Mendatang */}
            {jadwalMendatang.length > 0 && (
              <div className="bg-white border border-[#A1BC98] rounded">
                <div className="px-6 py-4 border-b border-[#A1BC98]">
                  <h2 className="text-xl font-semibold text-[#778873]">Jadwal Mendatang</h2>
                </div>
                <div className="divide-y divide-[#D2DCB6]">
                  {jadwalMendatang.map((jadwal) => (
                    <div key={jadwal.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-[#778873] mb-1">
                            {jadwal.nama_guru || 'Guru BK'}
                          </div>
                          <div className="text-sm text-[#778873]/70">
                            {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} • {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                          </div>
                          {jadwal.nama_layanan && (
                            <div className="text-sm text-[#778873]/70 mt-1">
                              Layanan: {jadwal.nama_layanan}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(jadwal.status || 'menunggu')}`}>
                          {getStatusLabel(jadwal.status || 'menunggu')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jadwalMendatang.length === 0 && (
              <div className="bg-white border border-[#A1BC98] rounded p-12 text-center">
                <p className="text-[#778873]/70">Tidak ada jadwal mendatang</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#778873]/70">Tidak ada data dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}
