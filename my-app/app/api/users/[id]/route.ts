import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/db';
import type { ApiResponse, UserUpdate } from '@/lib/types/database';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengambil data user', error: error.message },
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
    const userId = parseInt(id);
    const body = await request.json();
    const { 
      email, 
      foto_profil, 
      bio,
      nama_lengkap,
      alamat,
      no_telepon,
      kelas,
      jurusan
    } = body;

    const updateData: UserUpdate = {};

    if (email !== undefined) updateData.email = email;
    if (foto_profil !== undefined) updateData.foto_profil = foto_profil;
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (alamat !== undefined) updateData.alamat = alamat;
    if (no_telepon !== undefined) updateData.no_telepon = no_telepon;
    if (kelas !== undefined) updateData.kelas = kelas;
    if (jurusan !== undefined) updateData.jurusan = jurusan;

    const result = await updateUser(userId, updateData);

    if (!result) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Gagal mengupdate profile' },
        { status: 500 }
      );
    }

    const updatedUser = await getUserById(userId);
    const { password_hash, ...userWithoutPassword } = updatedUser!;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Profile berhasil diupdate',
      data: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengupdate profile', error: error.message },
      { status: 500 }
    );
  }
}

