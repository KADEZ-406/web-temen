import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import type { Notifikasi, NotifikasiCreate, ApiResponse } from '@/lib/types/database';

// GET: Ambil notifikasi user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const isRead = searchParams.get('is_read');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'User ID diperlukan' },
        { status: 400 }
      );
    }

    let sql = `SELECT * FROM notifikasi WHERE user_id = ?`;
    const params: any[] = [parseInt(userId)];

    if (isRead !== null) {
      sql += ` AND is_read = ?`;
      params.push(isRead === 'true');
    }

    sql += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(limit);

    const notifikasi = await query<Notifikasi>(sql, params);

    return NextResponse.json<ApiResponse<Notifikasi[]>>({
      success: true,
      data: notifikasi,
    });
  } catch (error: any) {
    console.error('Get notifikasi error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil notifikasi', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Buat notifikasi baru
export async function POST(request: NextRequest) {
  try {
    const body: NotifikasiCreate = await request.json();
    const { user_id, judul, pesan, tipe, link } = body;

    if (!user_id || !judul || !pesan) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'User ID, judul, dan pesan harus diisi' },
        { status: 400 }
      );
    }

    const result = await execute(
      `INSERT INTO notifikasi (user_id, judul, pesan, tipe, link) VALUES (?, ?, ?, ?, ?)`,
      [user_id, judul, pesan, tipe || 'info', link || null]
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Notifikasi berhasil dibuat',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    console.error('Create notifikasi error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal membuat notifikasi', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update status read notifikasi
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_read } = body;

    if (!id || is_read === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'ID dan is_read harus diisi' },
        { status: 400 }
      );
    }

    const result = await execute(
      `UPDATE notifikasi SET is_read = ?, read_at = ${is_read ? 'NOW()' : 'NULL'} WHERE id = ?`,
      [is_read, id]
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Notifikasi berhasil diupdate',
    });
  } catch (error: any) {
    console.error('Update notifikasi error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal update notifikasi', error: error.message },
      { status: 500 }
    );
  }
}

