import { NextRequest, NextResponse } from 'next/server';
import { createUser, usernameExists, emailExists, nisnExists } from '@/lib/db';
import type { ApiResponse, UserCreate } from '@/lib/types/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      username, 
      password, 
      email, 
      nisn,
      nama_lengkap, 
      jenis_kelamin, 
      tanggal_lahir, 
      alamat, 
      no_telepon, 
      kelas, 
      jurusan, 
      tahun_masuk 
    } = body;

    if (!username || !password || !nama_lengkap) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Username, password, dan nama lengkap harus diisi' },
        { status: 400 }
      );
    }

    if (await usernameExists(username)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Username sudah digunakan' },
        { status: 400 }
      );
    }

    if (email && await emailExists(email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Email sudah digunakan' },
        { status: 400 }
      );
    }

    if (nisn && await nisnExists(nisn)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'NISN sudah digunakan' },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userData: UserCreate = {
      username,
      password_hash,
      email: email || null,
      role: 'siswa',
      nisn: nisn || null,
      nama_lengkap,
      jenis_kelamin: jenis_kelamin || null,
      tanggal_lahir: tanggal_lahir || null,
      alamat: alamat || null,
      no_telepon: no_telepon || null,
      kelas: kelas || null,
      jurusan: jurusan || null,
      tahun_masuk: tahun_masuk ? parseInt(tahun_masuk) : null,
      is_active: true,
    };

    const userId = await createUser(userData);

    return NextResponse.json<ApiResponse<{ id: number }>>({
      success: true,
      message: 'Registrasi berhasil. Silakan login.',
      data: { id: userId },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal melakukan registrasi', error: error.message },
      { status: 500 }
    );
  }
}

