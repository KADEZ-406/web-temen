import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Ambil history konseling
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const siswaId = searchParams.get('siswa_id');
    const limit = parseInt(searchParams.get('limit') || '10');

    let sql = `
      SELECT 
        hk.*,
        u.nama_lengkap as nama_siswa,
        u.nisn,
        gb.nama_lengkap as nama_guru,
        gb.foto_profil as foto_guru,
        lb.nama_layanan,
        lb.warna
      FROM history_konseling hk
      INNER JOIN users u ON hk.siswa_id = u.id
      INNER JOIN guru_bk gb ON hk.guru_id = gb.id
      INNER JOIN layanan_bk lb ON hk.layanan_id = lb.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (siswaId) {
      sql += ` AND hk.siswa_id = ?`;
      params.push(parseInt(siswaId));
    }

    sql += ` ORDER BY hk.tanggal_konseling DESC, hk.waktu_mulai DESC LIMIT ?`;
    params.push(limit);

    const history = await query<any>(sql, params);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data history', error: error.message },
      { status: 500 }
    );
  }
}

