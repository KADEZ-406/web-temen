import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jadwalId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status harus diisi' },
        { status: 400 }
      );
    }

    const validStatuses = ['menunggu', 'dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan', 'tidak_hadir'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status tidak valid' },
        { status: 400 }
      );
    }

    const currentJadwal = await queryOne<any>(
      `SELECT * FROM jadwal_konseling WHERE id = ?`,
      [jadwalId]
    );

    if (!currentJadwal) {
      return NextResponse.json(
        { success: false, message: 'Jadwal tidak ditemukan' },
        { status: 404 }
      );
    }

    const result = await execute(
      `UPDATE jadwal_konseling SET status = ?, updated_at = ? WHERE id = ?`,
      [status, new Date().toISOString(), jadwalId]
    );

    if (status === 'selesai' || status === 'dibatalkan' || status === 'tidak_hadir') {
      const existingHistory = await queryOne<any>(
        `SELECT id FROM history_konseling WHERE jadwal_id = ?`,
        [jadwalId]
      );

      if (!existingHistory) {
        await execute(
          `INSERT INTO history_konseling 
           (jadwal_id, siswa_id, guru_id, layanan_id, tanggal_konseling, waktu_mulai, waktu_selesai, alasan_konseling, status, catatan_guru, rating, feedback)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            jadwalId,
            currentJadwal.siswa_id,
            currentJadwal.guru_id,
            currentJadwal.layanan_id,
            currentJadwal.tanggal,
            currentJadwal.waktu_mulai,
            currentJadwal.waktu_selesai,
            currentJadwal.alasan_konseling,
            status,
            currentJadwal.catatan_guru,
            currentJadwal.rating,
            currentJadwal.feedback,
          ]
        );
      }
    }

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

