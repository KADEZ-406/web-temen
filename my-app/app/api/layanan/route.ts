import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Ambil semua layanan BK
export async function GET() {
  try {
    const layanan = await query<any>(
      `SELECT * FROM layanan_bk 
       WHERE is_active = TRUE 
       ORDER BY nama_layanan ASC`
    );

    return NextResponse.json({
      success: true,
      data: layanan,
    });
  } catch (error: any) {
    console.error('Get layanan error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data layanan', error: error.message },
      { status: 500 }
    );
  }
}

