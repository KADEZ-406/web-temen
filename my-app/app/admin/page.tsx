'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import type { DashboardAdmin, PengaturanSistem } from "@/lib/types";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardAdmin | null>(null);
  const [pengaturanSistem, setPengaturanSistem] = useState<PengaturanSistem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxSessions, setMaxSessions] = useState('10');
  const [sessionDuration, setSessionDuration] = useState('60');
  const toast = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        fetchDashboardData(parsedUser.id, parsedUser.role);
        fetchPengaturanSistem();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (userId: number, role: string) => {
    try {
      const response = await fetch(`/api/dashboard?user_id=${userId}&role=${role}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPengaturanSistem = async () => {
    try {
      const response = await fetch('/api/pengaturan-sistem');
      const data = await response.json();
      
      if (data.success && data.data) {
        setPengaturanSistem(data.data);
        const notifAktif = data.data.find((p: PengaturanSistem) => p.key_setting === 'notifikasi_aktif');
        const notifEmail = data.data.find((p: PengaturanSistem) => p.key_setting === 'notifikasi_email');
        const backup = data.data.find((p: PengaturanSistem) => p.key_setting === 'backup_otomatis');
        const maintenance = data.data.find((p: PengaturanSistem) => p.key_setting === 'maintenance_mode');
        const maxSesi = data.data.find((p: PengaturanSistem) => p.key_setting === 'max_sesi_per_hari');
        const durasi = data.data.find((p: PengaturanSistem) => p.key_setting === 'durasi_sesi_menit');
        
        if (notifAktif) setNotifications(notifAktif.value_setting === 'true');
        if (notifEmail) setEmailNotifications(notifEmail.value_setting === 'true');
        if (backup) setAutoBackup(backup.value_setting === 'true');
        if (maintenance) setMaintenanceMode(maintenance.value_setting === 'true');
        if (maxSesi) setMaxSessions(maxSesi.value_setting || '10');
        if (durasi) setSessionDuration(durasi.value_setting || '60');
      }
    } catch (error) {
      console.error('Error fetching pengaturan sistem:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/periode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_periode: `Periode ${selectedDate} - ${endDate}`,
          tanggal_mulai: selectedDate,
          tanggal_selesai: endDate,
          waktu_mulai: startTime,
          waktu_selesai: endTime,
          is_active: isActive,
          keterangan: `Periode pemilihan guru BK dari ${selectedDate} hingga ${endDate}`,
          created_by: user.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Pengaturan waktu berhasil disimpan!');
        setIsScheduleOpen(false);
        setSelectedDate('');
        setEndDate('');
        setStartTime('');
        setEndTime('');
        setIsActive(false);
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Terjadi kesalahan saat menyimpan pengaturan');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updates = [
        { key_setting: 'notifikasi_aktif', value_setting: notifications.toString() },
        { key_setting: 'notifikasi_email', value_setting: emailNotifications.toString() },
        { key_setting: 'backup_otomatis', value_setting: autoBackup.toString() },
        { key_setting: 'maintenance_mode', value_setting: maintenanceMode.toString() },
        { key_setting: 'max_sesi_per_hari', value_setting: maxSessions },
        { key_setting: 'durasi_sesi_menit', value_setting: sessionDuration },
      ];

      const promises = updates.map(update =>
        fetch('/api/pengaturan-sistem', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...update,
            updated_by: user.id,
          }),
        })
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every(async (res) => {
        const data = await res.json();
        return data.success;
      });

      if (allSuccess) {
        toast.success('Pengaturan sistem berhasil disimpan!');
        setIsSettingsOpen(false);
      } else {
        toast.warning('Beberapa pengaturan gagal disimpan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Terjadi kesalahan saat menyimpan pengaturan');
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
            <Link href="/" className="flex items-center gap-3">
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
                Admin Dashboard
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Dashboard Admin</h1>
          <p className="text-[#778873]/70">Kelola sistem bimbingan konseling</p>
        </div>

        {/* Stats Grid */}
        {dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
              <div className="text-sm text-[#778873]/70 mb-1">Total Siswa</div>
              <div className="text-3xl font-bold text-[#778873]">{dashboardData.total_siswa || 0}</div>
            </div>
            <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
              <div className="text-sm text-[#778873]/70 mb-1">Guru Aktif</div>
              <div className="text-3xl font-bold text-[#778873]">{dashboardData.total_guru_aktif || 0}</div>
            </div>
            <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
              <div className="text-sm text-[#778873]/70 mb-1">Jadwal Mendatang</div>
              <div className="text-3xl font-bold text-[#778873]">{dashboardData.jadwal_mendatang || 0}</div>
            </div>
            <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
              <div className="text-sm text-[#778873]/70 mb-1">Konseling Hari Ini</div>
              <div className="text-3xl font-bold text-[#778873]">{dashboardData.konseling_hari_ini || 0}</div>
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#A1BC98] rounded p-6">
            <h3 className="text-lg font-semibold text-[#778873] mb-3">Atur Waktu Pemilihan</h3>
            <p className="text-sm text-[#778873]/70 mb-4">Atur jadwal waktu untuk siswa memilih guru BK</p>
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="w-full px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded transition-colors"
            >
              Buka Pengaturan
            </button>
          </div>

          <Link href="/admin/siswa" className="bg-white border border-[#A1BC98] rounded p-6 hover:border-[#778873] transition-colors">
            <h3 className="text-lg font-semibold text-[#778873] mb-3">Kelola Siswa</h3>
            <p className="text-sm text-[#778873]/70 mb-4">Lihat dan kelola data siswa</p>
            <div className="px-4 py-2 bg-[#778873] text-white text-center rounded">
              Buka Daftar Siswa
            </div>
          </Link>

          <Link href="/admin/jadwal" className="bg-white border border-[#A1BC98] rounded p-6 hover:border-[#778873] transition-colors">
            <h3 className="text-lg font-semibold text-[#778873] mb-3">Kelola Jadwal</h3>
            <p className="text-sm text-[#778873]/70 mb-4">Kelola jadwal konseling siswa</p>
            <div className="px-4 py-2 bg-[#778873] text-white text-center rounded">
              Buka Jadwal
            </div>
          </Link>

          <Link href="/admin/laporan" className="bg-white border border-[#A1BC98] rounded p-6 hover:border-[#778873] transition-colors">
            <h3 className="text-lg font-semibold text-[#778873] mb-3">Laporan</h3>
            <p className="text-sm text-[#778873]/70 mb-4">Lihat laporan dan statistik konseling</p>
            <div className="px-4 py-2 bg-[#778873] text-white text-center rounded">
              Buka Laporan
            </div>
          </Link>

          <Link href="/admin/guru" className="bg-white border border-[#A1BC98] rounded p-6 hover:border-[#778873] transition-colors">
            <h3 className="text-lg font-semibold text-[#778873] mb-3">Kelola Guru BK</h3>
            <p className="text-sm text-[#778873]/70 mb-4">Kelola data dan jadwal guru BK</p>
            <div className="px-4 py-2 bg-[#778873] text-white text-center rounded">
              Buka Daftar Guru
            </div>
          </Link>

          <div className="bg-white border border-[#A1BC98] rounded p-6">
            <h3 className="text-lg font-semibold text-[#778873] mb-3">Pengaturan Sistem</h3>
            <p className="text-sm text-[#778873]/70 mb-4">Konfigurasi pengaturan sistem</p>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded transition-colors"
            >
              Buka Pengaturan
            </button>
          </div>
        </div>
      </div>

      {/* Modal Atur Waktu */}
      {isScheduleOpen && (
        <div 
          className="fixed inset-0 bg-[#778873]/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsScheduleOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-2xl w-full border border-[#A1BC98]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#778873]">Atur Waktu Pemilihan Guru BK</h2>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="text-[#778873]/70 hover:text-[#778873]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Tanggal Mulai</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Tanggal Selesai</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={selectedDate}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Waktu Mulai (Harian)</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Waktu Selesai (Harian)</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  min={startTime}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#778873] border-[#A1BC98] rounded focus:ring-[#778873]"
                  />
                  <span className="ml-2 text-sm text-[#778873]/70">Aktifkan periode pemilihan ini</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="flex-1 px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pengaturan Sistem */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-[#778873]/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-3xl w-full border border-[#A1BC98] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#778873]">Pengaturan Sistem</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-[#778873]/70 hover:text-[#778873]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="bg-[#F1F3E0] rounded-lg p-5">
                <h3 className="text-lg font-semibold text-[#778873] mb-4">Notifikasi</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#778873]">Aktifkan Notifikasi</span>
                      <p className="text-xs text-[#778873]/70">Terima notifikasi untuk aktivitas sistem</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-5 h-5 text-[#778873] border-[#A1BC98] rounded focus:ring-[#778873]"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#778873]">Notifikasi Email</span>
                      <p className="text-xs text-[#778873]/70">Kirim notifikasi melalui email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-5 h-5 text-[#778873] border-[#A1BC98] rounded focus:ring-[#778873]"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-[#F1F3E0] rounded-lg p-5">
                <h3 className="text-lg font-semibold text-[#778873] mb-4">Backup & Keamanan</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#778873]">Backup Otomatis</span>
                      <p className="text-xs text-[#778873]/70">Backup data secara otomatis setiap hari</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                      className="w-5 h-5 text-[#778873] border-[#A1BC98] rounded focus:ring-[#778873]"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#778873]">Mode Maintenance</span>
                      <p className="text-xs text-[#778873]/70">Nonaktifkan akses pengguna saat maintenance</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="w-5 h-5 text-[#778873] border-[#A1BC98] rounded focus:ring-[#778873]"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-[#F1F3E0] rounded-lg p-5">
                <h3 className="text-lg font-semibold text-[#778873] mb-4">Pengaturan Konseling</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#778873] mb-2">Maksimal Sesi per Hari</label>
                    <input
                      type="number"
                      value={maxSessions}
                      onChange={(e) => setMaxSessions(e.target.value)}
                      min="1"
                      max="50"
                      className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#778873] mb-2">Durasi Sesi (menit)</label>
                    <input
                      type="number"
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                      min="15"
                      max="120"
                      step="15"
                      className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
