import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const siswaId = searchParams.get('siswa_id');
    const limit = parseInt(searchParams.get('limit') || '10');

    let sqlJadwal = `
      SELECT 
        jk.*,
        u.nama_lengkap as nama_siswa,
        u.nisn,
        gb.nama_lengkap as nama_guru,
        gb.foto_profil as foto_guru,
        lb.nama_layanan,
        lb.warna
      FROM jadwal_konseling jk
      INNER JOIN users u ON jk.siswa_id = u.id
      INNER JOIN guru_bk gb ON jk.guru_id = gb.id
      INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
      WHERE jk.deleted_at IS NULL
    `;

    const paramsJadwal: any[] = [];
    if (siswaId) {
      sqlJadwal += ` AND jk.siswa_id = ?`;
      paramsJadwal.push(parseInt(siswaId));
    }
    sqlJadwal += ` ORDER BY jk.tanggal DESC, jk.waktu_mulai DESC`;

    const jadwal = await query<any>(sqlJadwal, paramsJadwal);

    let sqlHistory = `
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

    const paramsHistory: any[] = [];
    if (siswaId) {
      sqlHistory += ` AND hk.siswa_id = ?`;
      paramsHistory.push(parseInt(siswaId));
    }
    sqlHistory += ` ORDER BY hk.tanggal_konseling DESC, hk.waktu_mulai DESC`;

    const historyData = await query<any>(sqlHistory, paramsHistory);

    const combined = [
      ...jadwal.map((j: any) => ({
        id: j.id,
        jadwal_id: j.id,
        siswa_id: j.siswa_id,
        guru_id: j.guru_id,
        layanan_id: j.layanan_id,
        tanggal_konseling: j.tanggal,
        waktu_mulai: j.waktu_mulai,
        waktu_selesai: j.waktu_selesai,
        alasan_konseling: j.alasan_konseling,
        status: j.status,
        catatan_guru: j.catatan_guru,
        hasil_konseling: null,
        tindak_lanjut: null,
        rating: j.rating,
        feedback: j.feedback,
        created_at: j.created_at,
        nama_siswa: j.nama_siswa,
        nisn: j.nisn,
        nama_guru: j.nama_guru,
        foto_guru: j.foto_guru,
        nama_layanan: j.nama_layanan,
        warna: j.warna,
        source_type: 'jadwal',
      })),
      ...historyData.map((h: any) => ({
        id: h.id,
        jadwal_id: h.jadwal_id,
        siswa_id: h.siswa_id,
        guru_id: h.guru_id,
        layanan_id: h.layanan_id,
        tanggal_konseling: h.tanggal_konseling,
        waktu_mulai: h.waktu_mulai,
        waktu_selesai: h.waktu_selesai,
        alasan_konseling: h.alasan_konseling,
        status: h.status,
        catatan_guru: h.catatan_guru,
        hasil_konseling: h.hasil_konseling,
        tindak_lanjut: h.tindak_lanjut,
        rating: h.rating,
        feedback: h.feedback,
        created_at: h.created_at,
        nama_siswa: h.nama_siswa,
        nisn: h.nisn,
        nama_guru: h.nama_guru,
        foto_guru: h.foto_guru,
        nama_layanan: h.nama_layanan,
        warna: h.warna,
        source_type: 'history',
      })),
    ];

    const history = combined
      .sort((a: any, b: any) => {
        const dateA = new Date(`${a.tanggal_konseling} ${a.waktu_mulai}`).getTime();
        const dateB = new Date(`${b.tanggal_konseling} ${b.waktu_mulai}`).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);

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

