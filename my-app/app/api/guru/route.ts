import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Ambil semua guru BK
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('is_active');

    let sql = `
      SELECT 
        gb.*,
        GROUP_CONCAT(lb.nama_layanan SEPARATOR ', ') as layanan
      FROM guru_bk gb
      LEFT JOIN guru_layanan gl ON gb.id = gl.guru_id
      LEFT JOIN layanan_bk lb ON gl.layanan_id = lb.id
      WHERE gb.deleted_at IS NULL
    `;

    const params: any[] = [];

    if (isActive !== null) {
      sql += ` AND gb.is_active = ?`;
      params.push(isActive === 'true');
    }

    sql += ` GROUP BY gb.id ORDER BY gb.nama_lengkap ASC`;

    const gurus = await query<any>(sql, params);

    // Format layanan menjadi array
    const formattedGurus = gurus.map((guru: any) => ({
      ...guru,
      layanan: guru.layanan ? guru.layanan.split(', ') : [],
    }));

    return NextResponse.json({
      success: true,
      data: formattedGurus,
    });
  } catch (error: any) {
    console.error('Get guru error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data guru', error: error.message },
      { status: 500 }
    );
  }
}

