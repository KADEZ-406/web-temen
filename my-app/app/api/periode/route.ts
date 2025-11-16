import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import type { PeriodePemilihan, ApiResponse } from '@/lib/types/database';

// GET: Ambil semua periode pemilihan
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('is_active');

    let sql = `SELECT * FROM periode_pemilihan WHERE 1=1`;
    const params: any[] = [];

    if (isActive !== null) {
      sql += ` AND is_active = ?`;
      params.push(isActive === 'true');
    }

    sql += ` ORDER BY created_at DESC`;

    const periode = await query<PeriodePemilihan>(sql, params);

    return NextResponse.json<ApiResponse<PeriodePemilihan[]>>({
      success: true,
      data: periode,
    });
  } catch (error: any) {
    console.error('Get periode error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil data periode', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Buat periode pemilihan baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama_periode, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, is_active, keterangan, created_by } = body;

    if (!nama_periode || !tanggal_mulai || !tanggal_selesai || !waktu_mulai || !waktu_selesai) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Jika ada periode aktif, nonaktifkan dulu
    if (is_active) {
      await execute(`UPDATE periode_pemilihan SET is_active = FALSE WHERE is_active = TRUE`);
    }

    const result = await execute(
      `INSERT INTO periode_pemilihan 
       (nama_periode, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, is_active, keterangan, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_periode, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, is_active || false, keterangan || null, created_by || null]
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Periode pemilihan berhasil dibuat',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    console.error('Create periode error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal membuat periode pemilihan', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update periode pemilihan
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'ID diperlukan' },
        { status: 400 }
      );
    }

    // Jika mengaktifkan periode, nonaktifkan yang lain
    if (updates.is_active) {
      await execute(`UPDATE periode_pemilihan SET is_active = FALSE WHERE is_active = TRUE AND id != ?`, [id]);
    }

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    const result = await execute(
      `UPDATE periode_pemilihan SET ${fields}, updated_at = NOW() WHERE id = ?`,
      [...values, id]
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Periode pemilihan berhasil diupdate',
    });
  } catch (error: any) {
    console.error('Update periode error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal update periode pemilihan', error: error.message },
      { status: 500 }
    );
  }
}

