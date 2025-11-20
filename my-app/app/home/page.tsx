'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { GuruBK } from "@/lib/types";

type Guru = {
  id: number;
  name: string;
  specialty: string;
  image: string;
};

interface JadwalGuru {
  id: number;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  nama_siswa: string;
  nama_layanan: string;
  status: string;
}

interface JadwalItem {
  id?: number;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  nama_siswa?: string;
  nama_layanan?: string;
  status?: string;
  isAvailable?: boolean;
}

export default function HomePage() {
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [guruBK, setGuruBK] = useState<Guru[]>([]);
  const [filteredGuruBK, setFilteredGuruBK] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<{[key: number]: number}>({});
  const [jadwalGuru, setJadwalGuru] = useState<JadwalGuru[]>([]);
  const [loadingJadwal, setLoadingJadwal] = useState(false);
  const [jadwalItems, setJadwalItems] = useState<JadwalItem[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        if (parsedUser.role === 'guru') {
          window.location.href = '/guru/dashboard';
          return;
        }
        if (parsedUser.role === 'admin') {
          window.location.href = '/admin';
          return;
        }
        
        if (parsedUser.role === 'siswa') {
          fetchGuruBK();
        }
      } else {
        fetchGuruBK();
      }
    }
  }, []);

  useEffect(() => {
    if (searchTerm || searchDate) {
      let filtered = guruBK;
      
      if (searchTerm) {
        filtered = filtered.filter(guru => 
          guru.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guru.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredGuruBK(filtered);
      
      if (searchDate) {
        filtered.forEach(guru => {
          fetchAvailableSlotsCount(guru.id, searchDate);
        });
      }
    } else {
      setFilteredGuruBK(guruBK);
      setAvailableSlots({});
    }
  }, [searchTerm, searchDate, guruBK]);

  const fetchAvailableSlotsCount = async (guruId: number, tanggal: string) => {
    try {
      const response = await fetch(`/api/guru/${guruId}/jadwal-tersedia?tanggal=${tanggal}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setAvailableSlots(prev => ({
          ...prev,
          [guruId]: data.data.available_slots?.length || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchGuruBK = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/guru?is_active=true');
      const data = await response.json();
      
      if (data.success && data.data) {
        const formattedGurus: Guru[] = data.data.map((guru: GuruBK) => ({
          id: guru.id,
          name: guru.nama_lengkap,
          specialty: guru.spesialisasi || 'Bimbingan Konseling',
          image: guru.foto_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama_lengkap)}&size=200&background=2563eb&color=fff`,
          layanan: [],
        }));
        setGuruBK(formattedGurus);
        setFilteredGuruBK(formattedGurus);
      }
    } catch (error) {
      console.error('Error fetching guru:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGuru) {
      fetchJadwalGuru(selectedGuru.id);
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    } else {
      setJadwalGuru([]);
      setJadwalItems([]);
      setSelectedDate('');
    }
  }, [selectedGuru]);

  useEffect(() => {
    if (selectedGuru && selectedDate) {
      fetchJadwalWithSlots(selectedGuru.id, selectedDate);
    }
  }, [selectedDate, selectedGuru]);

  const fetchJadwalGuru = async (guruId: number) => {
    try {
      setLoadingJadwal(true);
      const response = await fetch(`/api/jadwal?guru_id=${guruId}`);
      const data = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const today = new Date().toISOString().split('T')[0];
        const upcomingJadwal = data.data
          .filter((j: JadwalGuru) => {
            if (!j || !j.tanggal) return false;
            const jadwalDate = j.tanggal;
            return jadwalDate >= today;
          })
          .sort((a: JadwalGuru, b: JadwalGuru) => {
            if (!a.tanggal || !b.tanggal) return 0;
            const dateA = new Date(`${a.tanggal} ${a.waktu_mulai || '00:00:00'}`).getTime();
            const dateB = new Date(`${b.tanggal} ${b.waktu_mulai || '00:00:00'}`).getTime();
            return dateA - dateB;
          });
        
        setJadwalGuru(upcomingJadwal);
      } else {
        setJadwalGuru([]);
      }
    } catch (error) {
      console.error('Error fetching jadwal guru:', error);
      setJadwalGuru([]);
    } finally {
      setLoadingJadwal(false);
    }
  };

  const fetchJadwalWithSlots = async (guruId: number, tanggal: string) => {
    try {
      const [jadwalResponse, slotsResponse] = await Promise.all([
        fetch(`/api/jadwal?guru_id=${guruId}`),
        fetch(`/api/guru/${guruId}/jadwal-tersedia?tanggal=${tanggal}`)
      ]);

      const jadwalData = await jadwalResponse.json();
      const slotsData = await slotsResponse.json();

      const bookedJadwal: JadwalItem[] = [];
      if (jadwalData.success && jadwalData.data && Array.isArray(jadwalData.data)) {
        jadwalData.data
          .filter((j: JadwalGuru) => j.tanggal === tanggal)
          .forEach((j: JadwalGuru) => {
            bookedJadwal.push({
              id: j.id,
              tanggal: j.tanggal,
              waktu_mulai: j.waktu_mulai,
              waktu_selesai: j.waktu_selesai,
              nama_siswa: j.nama_siswa,
              nama_layanan: j.nama_layanan,
              status: j.status,
              isAvailable: false,
            });
          });
      }

      const availableSlots: JadwalItem[] = [];
      if (slotsData.success && slotsData.data && slotsData.data.available_slots) {
        slotsData.data.available_slots.forEach((slot: { start: string; end: string }) => {
          availableSlots.push({
            tanggal: tanggal,
            waktu_mulai: slot.start,
            waktu_selesai: slot.end,
            isAvailable: true,
          });
        });
      }

      const allJadwal = [...bookedJadwal, ...availableSlots].sort((a, b) => {
        const timeA = a.waktu_mulai || '00:00';
        const timeB = b.waktu_mulai || '00:00';
        return timeA.localeCompare(timeB);
      });

      setJadwalItems(allJadwal);
    } catch (error) {
      console.error('Error fetching jadwal with slots:', error);
      setJadwalItems([]);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'menunggu': 'Menunggu',
      'dijadwalkan': 'Dijadwalkan',
      'berlangsung': 'Berlangsung',
      'selesai': 'Selesai',
      'dibatalkan': 'Dibatalkan'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-white">
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
                BK SMK Taruna Bhakti
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={
                  user?.role === 'siswa' 
                    ? '/home' 
                    : user?.role === 'guru' 
                    ? '/guru/dashboard' 
                    : user?.role === 'admin'
                    ? '/admin'
                    : '/home'
                }
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

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#778873] mb-4">
            Pilih Guru BK
          </h1>
          <p className="text-[#778873]/70 mb-6">
            Pilih guru BK yang sesuai dengan kebutuhan konseling Anda
          </p>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <div>
              <input
                type="text"
                placeholder="Cari guru BK (nama atau spesialisasi)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              />
            </div>
            <div>
              <input
                type="date"
                placeholder="Pilih tanggal untuk melihat jadwal tersedia"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
            <p className="mt-4 text-[#778873]/70">Memuat data...</p>
          </div>
        ) : guruBK.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#778873]/70">Belum ada data guru BK</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuruBK.map((guru) => (
              <div
                key={guru.id}
                onClick={() => setSelectedGuru(guru)}
                className="bg-white border border-[#A1BC98] rounded p-6 cursor-pointer hover:border-[#778873] transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#778873]">
                    <Image
                      src={guru.image}
                      alt={guru.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#778873]">{guru.name}</h3>
                    <p className="text-sm text-[#778873]/70">{guru.specialty}</p>
                    {searchDate && availableSlots[guru.id] !== undefined && (
                      <p className="text-xs text-[#778873]/70 mt-1">
                        {availableSlots[guru.id]} slot tersedia
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/pilih-guru?guru_id=${guru.id}${searchDate ? `&tanggal=${searchDate}` : ''}`}
                  className="block w-full py-2 bg-[#778873] text-white text-center rounded hover:bg-[#778873] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Pilih Guru
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGuru && (
        <div 
          className="fixed inset-0 bg-[#778873]/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedGuru(null)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-3xl w-full border border-[#A1BC98] my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#778873] mx-auto mb-4">
                <Image
                  src={selectedGuru.image}
                  alt={selectedGuru.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl font-semibold text-[#778873] mb-2">{selectedGuru.name}</h3>
              <p className="text-[#778873]/70">{selectedGuru.specialty}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-[#778873]">Jadwal Konseling</h4>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-3 py-1 border border-[#A1BC98] rounded text-sm focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>
              {loadingJadwal ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#778873]"></div>
                  <p className="mt-2 text-sm text-[#778873]/70">Memuat jadwal...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {jadwalItems.length === 0 ? (
                    <div className="text-center py-4 text-[#778873]/70">
                      <p>Belum ada jadwal untuk tanggal ini</p>
                    </div>
                  ) : (
                    jadwalItems.map((item, index) => (
                      item.isAvailable ? (
                        <Link
                          key={`slot-${index}`}
                          href={`/pilih-guru?guru_id=${selectedGuru.id}&tanggal=${item.tanggal}&waktu_mulai=${item.waktu_mulai}&waktu_selesai=${item.waktu_selesai}`}
                          className="block border-2 border-dashed border-[#A1BC98] rounded p-4 hover:bg-[#F1F3E0] hover:border-[#778873] transition-colors cursor-pointer"
                          onClick={() => setSelectedGuru(null)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-[#778873] mb-1">
                                {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : '-'}
                              </div>
                              <div className="text-sm text-[#778873]/70">
                                {item.waktu_mulai || '-'} - {item.waktu_selesai || '-'}
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 shrink-0">
                              Tersedia
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <div
                          key={item.id || `booked-${index}`}
                          className="border border-[#A1BC98] rounded p-4 bg-[#F1F3E0]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-[#778873] mb-1">
                                {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : '-'}
                              </div>
                              <div className="text-sm text-[#778873]/70 mb-1">
                                {item.waktu_mulai || '-'} - {item.waktu_selesai || '-'}
                              </div>
                              {item.nama_siswa ? (
                                <div className="text-sm text-[#778873]/70 mb-1">
                                  Siswa: {item.nama_siswa}
                                </div>
                              ) : null}
                              {item.nama_layanan ? (
                                <div className="text-sm text-[#778873]/70">
                                  Layanan: {item.nama_layanan}
                                </div>
                              ) : null}
                            </div>
                            <span className="px-3 py-1 rounded text-xs font-medium bg-[#D2DCB6] text-[#778873] shrink-0">
                              {getStatusLabel(item.status || 'menunggu')}
                            </span>
                          </div>
                        </div>
                      )
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/pilih-guru?guru_id=${selectedGuru.id}${searchDate ? `&tanggal=${searchDate}` : ''}`}
                className="flex-1 py-2 bg-[#778873] text-white text-center rounded hover:bg-[#778873] transition-colors"
                onClick={() => setSelectedGuru(null)}
              >
                Buat Janji
              </Link>
              <button 
                onClick={() => setSelectedGuru(null)}
                className="flex-1 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
