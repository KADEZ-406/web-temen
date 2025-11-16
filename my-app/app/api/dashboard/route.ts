import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

// GET: Ambil data dashboard
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
      // Dashboard siswa
      const dashboard = await queryOne<any>(
        `SELECT * FROM vw_dashboard_siswa WHERE siswa_id = ?`,
        [parseInt(userId)]
      );

      return NextResponse.json({
        success: true,
        data: dashboard || {
          siswa_id: parseInt(userId),
          nama_siswa: '',
          total_konseling: 0,
          konseling_selesai: 0,
          jadwal_mendatang: 0,
          konseling_berlangsung: 0,
        },
      });
    } else if (role === 'admin' || role === 'super_admin') {
      // Dashboard admin
      const dashboard = await queryOne<any>(
        `SELECT * FROM vw_dashboard_admin`
      );

      return NextResponse.json({
        success: true,
        data: dashboard || {
          total_siswa: 0,
          total_guru_aktif: 0,
          jadwal_mendatang: 0,
          konseling_berlangsung: 0,
          konseling_hari_ini: 0,
          konseling_bulan_ini: 0,
        },
      });
    } else if (role === 'guru') {
      // Dashboard guru - userId is actually guru_id here
      const guruId = parseInt(userId);
      
      // Get jadwal statistics for this guru
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

      return NextResponse.json({
        success: true,
        data: {
          total_jadwal: totalJadwal?.count || 0,
          jadwal_hari_ini: jadwalHariIni?.count || 0,
          jadwal_mendatang: jadwalMendatang?.count || 0,
          jadwal_selesai: jadwalSelesai?.count || 0,
          jadwal_berlangsung: jadwalBerlangsung?.count || 0,
        },
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

