import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';
import type { ApiResponse } from '@/lib/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guruId = parseInt(id);

    const guru = await queryOne<any>(
      `SELECT * FROM guru_bk WHERE id = ? AND deleted_at IS NULL`,
      [guruId]
    );

    if (!guru) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Guru tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: guru,
    });
  } catch (error: any) {
    console.error('Get guru error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil data guru', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guruId = parseInt(id);
    const body = await request.json();
    const { batas_pertemuan, hari_libur, status } = body;

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (status !== undefined) {
      const isActive = status === 'aktif';
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Tidak ada data yang diupdate' },
        { status: 400 }
      );
    }

    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());
    updateValues.push(guruId);

    const sql = `UPDATE guru_bk SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await execute(sql, updateValues);

    const updatedGuru = await queryOne<any>(
      `SELECT * FROM guru_bk WHERE id = ? AND deleted_at IS NULL`,
      [guruId]
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Pengaturan berhasil diupdate',
      data: updatedGuru,
    });
  } catch (error: any) {
    console.error('Update guru error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengupdate pengaturan', error: error.message },
      { status: 500 }
    );
  }
}

