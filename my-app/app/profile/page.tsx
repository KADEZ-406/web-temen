'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/contexts/ToastContext";
import type { HistoryKonselingWithRelations, User, PengaturanUser } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [name, setName] = useState('John Doe');
  const [nisn, setNisn] = useState('1234567890');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryKonselingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setPengaturan] = useState<PengaturanUser | null>(null);
  const [passwordData, setPasswordData] = useState({
    password_lama: '',
    password_baru: '',
    password_baru_confirm: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fetchHistory = async (userId: number, userRole: string) => {
    try {
      if (userRole === 'siswa') {
        const response = await fetch(`/api/history?siswa_id=${userId}&limit=20`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setHistory(data.data);
        }
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setName(parsedUser.nama_lengkap || 'John Doe');
        setNisn(parsedUser.nisn || '1234567890');
        setProfileImage(parsedUser.foto_profil);
        fetchHistory(parsedUser.id, parsedUser.role);
        fetchPengaturan(parsedUser.id);
        
        if (parsedUser.role === 'siswa') {
          const interval = setInterval(() => {
            fetchHistory(parsedUser.id, parsedUser.role);
          }, 30000);
          
          return () => clearInterval(interval);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchPengaturan = async (userId: number) => {
    try {
      const response = await fetch(`/api/pengaturan?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setPengaturan(data.data);
        setNotifications(data.data.notifikasi_aktif);
        setEmailNotifications(data.data.notifikasi_email);
      }
    } catch (error) {
      console.error('Error fetching pengaturan:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'selesai': 'Selesai',
      'dibatalkan': 'Dibatalkan',
      'berlangsung': 'Berlangsung',
      'dijadwalkan': 'Dijadwalkan',
      'menunggu': 'Menunggu'
    };
    return labels[status] || 'Tidak Diketahui';
  };

  const getStatusColor = () => {
    return 'bg-[#D2DCB6] text-[#778873]';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
          <p className="mt-4 text-[#778873]/70">Memuat profile...</p>
        </div>
      </div>
    );
  }

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
                Profile
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {user?.role === 'guru' ? (
                <>
                  <Link
                    href="/guru/dashboard"
                    className="px-4 py-2 text-[#778873] hover:text-[#778873]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/guru/jadwal"
                    className="px-4 py-2 text-[#778873] hover:text-[#778873]"
                  >
                    Jadwal
                  </Link>
                  <Link
                    href="/guru/pengaturan"
                    className="px-4 py-2 text-[#778873] hover:text-[#778873]"
                  >
                    Pengaturan
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={
                      user?.role === 'siswa' 
                        ? '/home' 
                        : user?.role === 'admin'
                        ? '/admin'
                        : '/home'
                    }
                    className="px-4 py-2 text-[#778873] hover:text-[#778873]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white border border-[#A1BC98] rounded-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#778873] shrink-0">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-[#778873] flex items-center justify-center text-3xl font-bold text-white">
                  {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#778873] mb-2">{name}</h1>
              {user.role === 'siswa' && user.nisn && (
                <p className="text-[#778873]/70 mb-1">NISN: {user.nisn}</p>
              )}
              {user.role === 'guru' && (
                <p className="text-[#778873]/70 mb-1">Guru Bimbingan Konseling</p>
              )}
              {user.role === 'admin' && (
                <p className="text-[#778873]/70 mb-1">Administrator</p>
              )}
              <div className="text-sm text-[#778873]/70 mt-2">
                {user.kelas && <span>Kelas: {user.kelas}</span>}
                {user.jurusan && <span className="ml-4">Jurusan: {user.jurusan}</span>}
                {user.email && <span className="ml-4">Email: {user.email}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded transition-colors"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin logout?')) {
                    localStorage.removeItem('user');
                    router.push('/');
                  }
                }}
                className="px-4 py-2 border border-[#778873] text-[#778873] hover:bg-[#F1F3E0] rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {user.role === 'siswa' && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
              <div className="text-3xl font-bold text-[#778873] mb-1">{history.length}</div>
              <div className="text-sm text-[#778873]/70">Sesi Konseling</div>
            </div>
            <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
              <div className="text-3xl font-bold text-[#778873] mb-1">{history.filter(h => h.status === 'selesai').length}</div>
              <div className="text-sm text-[#778873]/70">Konseling Selesai</div>
            </div>
          </div>
        )}

        {/* History Konseling - Hanya untuk siswa */}
        {user.role === 'siswa' && (
          <div className="bg-white border border-[#A1BC98] rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-[#A1BC98]">
              <h2 className="text-xl font-semibold text-[#778873]">History Konseling</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
                <p className="mt-4 text-[#778873]/70">Memuat history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#778873]/70">Belum ada history konseling</p>
              </div>
            ) : (
              <div className="divide-y divide-[#D2DCB6]">
                {history.map((item) => (
                  <div key={item.id} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-[#778873] mb-1">{item.nama_guru || 'Guru BK'}</div>
                        <div className="text-sm text-[#778873]/70 mb-1">{item.nama_layanan || 'Konseling'}</div>
                        <div className="text-sm text-[#778873]/70">
                          {new Date(item.tanggal_konseling).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} • {item.waktu_mulai} - {item.waktu_selesai}
                        </div>
                        {item.alasan_konseling && (
                          <div className="mt-2 text-sm text-[#778873]/70">
                            <span className="font-medium">Alasan: </span>{item.alasan_konseling}
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
                        {getStatusLabel(item.status as string)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-white border border-[#A1BC98] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#778873] mb-4">Pengaturan</h3>
          <div className="space-y-3">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="w-full px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors text-left"
            >
              Ubah Password
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors text-left"
            >
              Pengaturan Notifikasi
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {isEditProfileOpen && (
        <div 
          className="fixed inset-0 bg-[#778873]/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditProfileOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-2xl w-full border border-[#A1BC98]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#778873]">Edit Profile</h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-[#778873]/70 hover:text-[#778873]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!user) return;

              try {
                const response = await fetch(`/api/users/${user.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: user.email,
                    foto_profil: profileImage,
                    nama_lengkap: name,
                    alamat: user.alamat,
                    no_telepon: user.no_telepon,
                    kelas: user.kelas,
                    jurusan: user.jurusan,
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  toast.success('Profil berhasil diperbarui!');
                  if (data.data) {
                    localStorage.setItem('user', JSON.stringify(data.data));
                    setUser(data.data);
                  }
                  setIsEditProfileOpen(false);
                } else {
                  toast.error(data.message || 'Gagal memperbarui profil');
                }
              } catch (error) {
                console.error('Error updating profile:', error);
                toast.error('Terjadi kesalahan saat memperbarui profil');
              }
            }} className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#778873] mb-4">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-[#778873] flex items-center justify-center text-2xl font-bold text-white">
                      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded text-sm transition-colors">
                    Ubah Foto
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                />
              </div>

              {user.role === 'siswa' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#778873] mb-2">NISN</label>
                    <input
                      type="text"
                      value={nisn}
                      onChange={(e) => setNisn(e.target.value)}
                      className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                      readOnly
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#778873] mb-2">Kelas</label>
                      <input
                        type="text"
                        value={user.kelas || ''}
                        onChange={(e) => setUser({...user, kelas: e.target.value})}
                        className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#778873] mb-2">Jurusan</label>
                      <input
                        type="text"
                        value={user.jurusan || ''}
                        onChange={(e) => setUser({...user, jurusan: e.target.value})}
                        className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#778873] mb-2">No. Telepon</label>
                    <input
                      type="tel"
                      value={user.no_telepon || ''}
                      onChange={(e) => setUser({...user, no_telepon: e.target.value})}
                      className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#778873] mb-2">Alamat</label>
                    <textarea
                      value={user.alamat || ''}
                      onChange={(e) => setUser({...user, alamat: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
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

      {/* Modal Ubah Password */}
      {isChangePasswordOpen && (
        <div 
          className="fixed inset-0 bg-[#778873]/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsChangePasswordOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-2xl w-full border border-[#A1BC98]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#778873]">Ubah Password</h2>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-[#778873]/70 hover:text-[#778873]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!user) return;

              if (passwordData.password_baru !== passwordData.password_baru_confirm) {
                toast.warning('Password baru dan konfirmasi password tidak sama');
                return;
              }

              if (passwordData.password_baru.length < 6) {
                toast.warning('Password baru minimal 6 karakter');
                return;
              }

              setIsChangingPassword(true);
              try {
                const response = await fetch('/api/users/password', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    password_lama: passwordData.password_lama,
                    password_baru: passwordData.password_baru,
                    current_user_id: user.id,
                    current_user_role: user.role,
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  toast.success('Password berhasil diubah!');
                  setIsChangePasswordOpen(false);
                  setPasswordData({
                    password_lama: '',
                    password_baru: '',
                    password_baru_confirm: '',
                  });
                } else {
                  toast.error(data.message || 'Gagal mengubah password');
                }
              } catch (error) {
                console.error('Error changing password:', error);
                toast.error('Terjadi kesalahan saat mengubah password');
              } finally {
                setIsChangingPassword(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Password Lama</label>
                <input
                  type="password"
                  value={passwordData.password_lama}
                  onChange={(e) => setPasswordData({ ...passwordData, password_lama: e.target.value })}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="Masukkan password lama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Password Baru</label>
                <input
                  type="password"
                  value={passwordData.password_baru}
                  onChange={(e) => setPasswordData({ ...passwordData, password_baru: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="Masukkan password baru (min. 6 karakter)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={passwordData.password_baru_confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, password_baru_confirm: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
                  placeholder="Konfirmasi password baru"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] transition-colors"
                  disabled={isChangingPassword}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Mengubah...' : 'Ubah Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pengaturan */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-[#778873]/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-2xl w-full border border-[#A1BC98]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#778873]">Pengaturan Notifikasi</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-[#778873]/70 hover:text-[#778873]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!user) return;
              
              try {
                const response = await fetch('/api/pengaturan', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    notifikasi_aktif: notifications,
                    notifikasi_email: emailNotifications,
                    tema_preferensi: 'light',
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  toast.success('Pengaturan berhasil disimpan!');
                  setIsSettingsOpen(false);
                  fetchPengaturan(user.id);
                } else {
                  toast.error('Gagal menyimpan pengaturan');
                }
              } catch (error) {
                console.error('Error saving settings:', error);
                toast.error('Terjadi kesalahan saat menyimpan pengaturan');
              }
            }} className="space-y-4">
              <div className="bg-[#F1F3E0] rounded-lg p-5">
                <h3 className="text-lg font-semibold text-[#778873] mb-4">Notifikasi</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#778873]">Aktifkan Notifikasi</span>
                      <p className="text-xs text-[#778873]/70">Terima notifikasi untuk jadwal dan aktivitas</p>
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
