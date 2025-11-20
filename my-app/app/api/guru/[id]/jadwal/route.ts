import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import type { ApiResponse } from '@/lib/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guruId = parseInt(id);

    const jadwal = await query<any>(
      `SELECT 
        jk.*,
        u.nama_lengkap as nama_siswa,
        u.nisn,
        lb.nama_layanan
      FROM jadwal_konseling jk
      INNER JOIN users u ON jk.siswa_id = u.id
      INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
      WHERE jk.guru_id = ? AND jk.deleted_at IS NULL
      ORDER BY jk.tanggal ASC, jk.waktu_mulai ASC`,
      [guruId]
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: jadwal,
    });
  } catch (error: any) {
    console.error('Get jadwal guru error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil jadwal', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guruId = parseInt(id);
    const body = await request.json();
    const { tanggal, waktu_mulai, waktu_selesai, is_libur } = body;

    if (!tanggal || waktu_mulai === undefined || waktu_selesai === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Tanggal, waktu mulai, dan waktu selesai harus diisi' },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Jadwal berhasil diatur',
    });
  } catch (error: any) {
    console.error('Set jadwal guru error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengatur jadwal', error: error.message },
      { status: 500 }
    );
  }
}

