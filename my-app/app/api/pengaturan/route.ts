import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import type { PengaturanUser, ApiResponse } from '@/lib/types/database';

// GET: Ambil pengaturan user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'User ID diperlukan' },
        { status: 400 }
      );
    }

    const pengaturan = await queryOne<PengaturanUser>(
      `SELECT * FROM pengaturan_user WHERE user_id = ?`,
      [parseInt(userId)]
    );

    if (!pengaturan) {
      // Return default settings
      return NextResponse.json<ApiResponse<PengaturanUser>>({
        success: true,
        data: {
          id: 0,
          user_id: parseInt(userId),
          notifikasi_aktif: true,
          notifikasi_email: true,
          tema_preferensi: 'auto',
          bahasa: 'id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json<ApiResponse<PengaturanUser>>({
      success: true,
      data: pengaturan,
    });
  } catch (error: any) {
    console.error('Get pengaturan error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil pengaturan', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update pengaturan user
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, notifikasi_aktif, notifikasi_email, tema_preferensi, bahasa } = body;

    if (!user_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'User ID diperlukan' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (notifikasi_aktif !== undefined) updates.notifikasi_aktif = notifikasi_aktif;
    if (notifikasi_email !== undefined) updates.notifikasi_email = notifikasi_email;
    if (tema_preferensi !== undefined) updates.tema_preferensi = tema_preferensi;
    if (bahasa !== undefined) updates.bahasa = bahasa;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Tidak ada data untuk diupdate' },
        { status: 400 }
      );
    }

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    const result = await execute(
      `UPDATE pengaturan_user SET ${fields}, updated_at = NOW() WHERE user_id = ?`,
      [...values, user_id]
    );

    if (result.affectedRows === 0) {
      // Create if not exists
      await execute(
        `INSERT INTO pengaturan_user (user_id, notifikasi_aktif, notifikasi_email, tema_preferensi, bahasa) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          user_id,
          notifikasi_aktif ?? true,
          notifikasi_email ?? true,
          tema_preferensi ?? 'auto',
          bahasa ?? 'id',
        ]
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Pengaturan berhasil diupdate',
    });
  } catch (error: any) {
    console.error('Update pengaturan error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal update pengaturan', error: error.message },
      { status: 500 }
    );
  }
}

