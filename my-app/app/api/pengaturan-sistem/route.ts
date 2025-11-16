import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import type { PengaturanSistem, ApiResponse } from '@/lib/types/database';

// GET: Ambil pengaturan sistem
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const kategori = searchParams.get('kategori');
    const key = searchParams.get('key');

    let sql = `SELECT * FROM pengaturan_sistem WHERE 1=1`;
    const params: any[] = [];

    if (kategori) {
      sql += ` AND kategori = ?`;
      params.push(kategori);
    }

    if (key) {
      sql += ` AND key_setting = ?`;
      params.push(key);
    }

    sql += ` ORDER BY kategori, key_setting`;

    const pengaturan = await query<PengaturanSistem>(sql, params);

    return NextResponse.json<ApiResponse<PengaturanSistem[]>>({
      success: true,
      data: pengaturan,
    });
  } catch (error: any) {
    console.error('Get pengaturan sistem error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil pengaturan sistem', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update pengaturan sistem
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { key_setting, value_setting, updated_by } = body;

    if (!key_setting) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Key setting diperlukan' },
        { status: 400 }
      );
    }

    const result = await execute(
      `UPDATE pengaturan_sistem SET value_setting = ?, updated_by = ?, updated_at = NOW() WHERE key_setting = ?`,
      [value_setting, updated_by || null, key_setting]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Pengaturan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Pengaturan sistem berhasil diupdate',
    });
  } catch (error: any) {
    console.error('Update pengaturan sistem error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal update pengaturan sistem', error: error.message },
      { status: 500 }
    );
  }
}

