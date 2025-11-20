import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const role = searchParams.get('role');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID diperlukan' },
        { status: 400 }
      );
    }

    if (role === 'siswa') {
      const siswaId = parseInt(userId);
      
      const totalKonseling = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE siswa_id = ? AND deleted_at IS NULL`,
        [siswaId]
      );
      const konselingSelesai = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE siswa_id = ? AND status = 'selesai' AND deleted_at IS NULL`,
        [siswaId]
      );
      const today = new Date().toISOString().split('T')[0];
      const jadwalMendatang = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling 
         WHERE siswa_id = ? 
         AND status IN ('menunggu', 'dijadwalkan', 'berlangsung') 
         AND tanggal >= ? 
         AND deleted_at IS NULL`,
        [siswaId, today]
      );
      const konselingBerlangsung = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE siswa_id = ? AND status = 'berlangsung' AND deleted_at IS NULL`,
        [siswaId]
      );
      const dashboardData = {
        siswa_id: siswaId,
        total_konseling: totalKonseling?.count || 0,
        konseling_selesai: konselingSelesai?.count || 0,
        jadwal_mendatang: jadwalMendatang?.count || 0,
        konseling_berlangsung: konselingBerlangsung?.count || 0,
      };

      return NextResponse.json({
        success: true,
        data: dashboardData,
      });
    } else if (role === 'admin') {
      const totalSiswa = await queryOne<any>(
        `SELECT COUNT(*) as count FROM users WHERE role = 'siswa' AND is_active = TRUE AND deleted_at IS NULL`
      );

      const totalGuruAktif = await queryOne<any>(
        `SELECT COUNT(*) as count FROM guru_bk WHERE is_active = TRUE AND deleted_at IS NULL`
      );

      const today = new Date().toISOString().split('T')[0];
      const jadwalMendatang = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE status IN ('menunggu', 'dijadwalkan', 'berlangsung') AND tanggal >= ? AND deleted_at IS NULL`,
        [today]
      );

      const konselingHariIni = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE tanggal = ? AND deleted_at IS NULL`,
        [today]
      );

      const konselingBerlangsung = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE status = 'berlangsung' AND deleted_at IS NULL`
      );

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const konselingBulanIni = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE tanggal >= ? AND deleted_at IS NULL`,
        [firstDayOfMonth]
      );

      const dashboardData = {
        total_siswa: totalSiswa?.count || 0,
        total_guru_aktif: totalGuruAktif?.count || 0,
        jadwal_mendatang: jadwalMendatang?.count || 0,
        konseling_berlangsung: konselingBerlangsung?.count || 0,
        konseling_hari_ini: konselingHariIni?.count || 0,
        konseling_bulan_ini: konselingBulanIni?.count || 0,
      };

      return NextResponse.json({
        success: true,
        data: dashboardData,
      });
    } else if (role === 'guru') {
      const guruId = parseInt(userId);
      
      const totalJadwal = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND deleted_at IS NULL`,
        [guruId]
      );
      const today = new Date().toISOString().split('T')[0];
      const jadwalHariIni = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND tanggal = ? AND deleted_at IS NULL`,
        [guruId, today]
      );
      const jadwalMendatang = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND status = 'dijadwalkan' AND tanggal >= ? AND deleted_at IS NULL`,
        [guruId, today]
      );
      const jadwalSelesai = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND status = 'selesai' AND deleted_at IS NULL`,
        [guruId]
      );
      const jadwalBerlangsung = await queryOne<any>(
        `SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND status = 'berlangsung' AND deleted_at IS NULL`,
        [guruId]
      );
      const dashboardData = {
        total_jadwal: totalJadwal?.count || 0,
        jadwal_hari_ini: jadwalHariIni?.count || 0,
        jadwal_mendatang: jadwalMendatang?.count || 0,
        jadwal_selesai: jadwalSelesai?.count || 0,
        jadwal_berlangsung: jadwalBerlangsung?.count || 0,
      };

      return NextResponse.json({
        success: true,
        data: dashboardData,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Role tidak valid' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Get dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data dashboard', error: error.message },
      { status: 500 }
    );
  }
}

