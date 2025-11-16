import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';

// PATCH: Update status jadwal konseling
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jadwalId = parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status harus diisi' },
        { status: 400 }
      );
    }

    // Validasi status
    const validStatuses = ['menunggu', 'dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan', 'tidak_hadir'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status tidak valid' },
        { status: 400 }
      );
    }

    // Update status
    await execute(
      `UPDATE jadwal_konseling SET status = ?, updated_at = ? WHERE id = ?`,
      [status, new Date().toISOString(), jadwalId]
    );

    // Get updated jadwal
    const updatedJadwal = await queryOne<any>(
      `SELECT * FROM jadwal_konseling WHERE id = ?`,
      [jadwalId]
    );

    return NextResponse.json({
      success: true,
      message: 'Status jadwal berhasil diupdate',
      data: updatedJadwal,
    });
  } catch (error: any) {
    console.error('Update jadwal error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate jadwal', error: error.message },
      { status: 500 }
    );
  }
}

