import { NextRequest, NextResponse } from 'next/server';
import { getAllSiswa, searchUsers } from '@/lib/db';
import type { User, ApiResponse } from '@/lib/types/database';

// GET: Ambil semua siswa
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const kelas = searchParams.get('kelas');
    const jurusan = searchParams.get('jurusan');
    const search = searchParams.get('search');

    let siswa: User[];

    if (search) {
      siswa = await searchUsers(search, 'siswa');
    } else {
      siswa = await getAllSiswa(kelas || undefined, jurusan || undefined);
    }

    return NextResponse.json<ApiResponse<User[]>>({
      success: true,
      data: siswa,
    });
  } catch (error: any) {
    console.error('Get siswa error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil data siswa', error: error.message },
      { status: 500 }
    );
  }
}

