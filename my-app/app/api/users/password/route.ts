import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/db';
import type { ApiResponse } from '@/lib/types/database';
import bcrypt from 'bcryptjs';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, password_lama, password_baru, current_user_id, current_user_role } = body;

    if (!user_id || !password_baru) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'User ID dan password baru harus diisi' },
        { status: 400 }
      );
    }

    if (!current_user_id || !current_user_role) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Autentikasi diperlukan' },
        { status: 401 }
      );
    }

    if (password_baru.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Password baru minimal 6 karakter' },
        { status: 400 }
      );
    }

    const user = await getUserById(user_id);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const isAdmin = current_user_role === 'admin';
    const isOwnAccount = parseInt(current_user_id) === user_id;

    if (!isAdmin && !isOwnAccount) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Anda hanya dapat mengubah password sendiri' },
        { status: 403 }
      );
    }

    if (password_lama) {
      const isPasswordValid = await bcrypt.compare(password_lama, user.password_hash);
      if (!isPasswordValid) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: 'Password lama salah' },
          { status: 401 }
        );
      }
    } else if (!isAdmin && isOwnAccount) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Password lama harus diisi untuk mengubah password sendiri' },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password_baru, 10);

    const updated = await updateUser(user_id, { password_hash });

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Gagal mengupdate password' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Password berhasil diupdate',
    });
  } catch (error: any) {
    console.error('Update password error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal mengupdate password', error: error.message },
      { status: 500 }
    );
  }
}

