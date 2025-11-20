import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guruId = parseInt(id);
    const searchParams = request.nextUrl.searchParams;
    const tanggal = searchParams.get('tanggal');

    if (!tanggal) {
      return NextResponse.json(
        { success: false, message: 'Tanggal harus diisi' },
        { status: 400 }
      );
    }

    const bookedJadwal = await query<any>(
      `SELECT waktu_mulai, waktu_selesai FROM jadwal_konseling 
       WHERE guru_id = ? AND tanggal = ? 
       AND status IN ('menunggu', 'dijadwalkan', 'berlangsung')
       AND deleted_at IS NULL
       ORDER BY waktu_mulai ASC`,
      [guruId, tanggal]
    );

    const workingHours: { start: string; end: string }[] = [];
    const startHour = 6;
    const startMinute = 30;
    const endHour = 19;
    const endMinute = 0;
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const startTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
      
      if (currentHour > endHour || (currentHour === endHour && currentMinute > endMinute)) {
        break;
      }
      
      const endTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      workingHours.push({ start: startTime, end: endTime });
    }

    const availableSlots = workingHours.filter(slot => {
      const slotStart = slot.start;
      const slotEnd = slot.end;

      const isBooked = bookedJadwal.some((booked: any) => {
        const bookedStart = booked.waktu_mulai;
        const bookedEnd = booked.waktu_selesai;

        return (
          (slotStart >= bookedStart && slotStart < bookedEnd) ||
          (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
          (slotStart <= bookedStart && slotEnd >= bookedEnd)
        );
      });

      return !isBooked;
    });

    return NextResponse.json({
      success: true,
      data: {
        tanggal,
        available_slots: availableSlots,
        booked_slots: bookedJadwal,
      },
    });
  } catch (error: any) {
    console.error('Get jadwal tersedia error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil jadwal tersedia', error: error.message },
      { status: 500 }
    );
  }
}

