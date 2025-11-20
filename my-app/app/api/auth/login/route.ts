import { NextRequest, NextResponse } from 'next/server';
import { getUserByIdentifier, updateLastLogin } from '@/lib/db';
import type { LoginResponse } from '@/lib/types/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    // Coba cari user tanpa filter role dulu (deteksi otomatis)
    let user;
    try {
      user = await getUserByIdentifier(username);
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Terjadi kesalahan saat mengakses database',
          error: dbError.message || 'Database error'
        },
        { status: 500 }
      );
    }

    if (!user) {
      console.log('User not found:', { username });
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, message: 'Data user tidak valid' },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    try {
      await updateLastLogin(user.id);
    } catch (updateError) {
      console.error('Failed to update last login:', updateError);
    }

    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan saat login', 
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

