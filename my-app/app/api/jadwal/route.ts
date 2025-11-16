import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';

// GET: Ambil jadwal konseling
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const siswaId = searchParams.get('siswa_id');
    const guruId = searchParams.get('guru_id');
    const status = searchParams.get('status');

    let sql = `
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

    const params: any[] = [];

    if (siswaId) {
      sql += ` AND jk.siswa_id = ?`;
      params.push(parseInt(siswaId));
    }

    if (guruId) {
      sql += ` AND jk.guru_id = ?`;
      params.push(parseInt(guruId));
    }

    if (status) {
      sql += ` AND jk.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY jk.tanggal DESC, jk.waktu_mulai DESC`;

    const jadwal = await query<any>(sql, params);

    return NextResponse.json({
      success: true,
      data: jadwal,
    });
  } catch (error: any) {
    console.error('Get jadwal error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data jadwal', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Buat jadwal konseling baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siswa_id, guru_id, layanan_id, tanggal, waktu_mulai, waktu_selesai, alasan_konseling } = body;

    if (!siswa_id || !guru_id || !layanan_id || !tanggal || !waktu_mulai || !waktu_selesai || !alasan_konseling) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    const result = await execute(
      `INSERT INTO jadwal_konseling 
       (siswa_id, guru_id, layanan_id, tanggal, waktu_mulai, waktu_selesai, alasan_konseling, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'menunggu')`,
      [siswa_id, guru_id, layanan_id, tanggal, waktu_mulai, waktu_selesai, alasan_konseling]
    );

    return NextResponse.json({
      success: true,
      message: 'Jadwal konseling berhasil dibuat',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    console.error('Create jadwal error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat jadwal konseling', error: error.message },
      { status: 500 }
    );
  }
}

