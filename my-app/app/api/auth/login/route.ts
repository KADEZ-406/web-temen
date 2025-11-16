import { NextRequest, NextResponse } from 'next/server';
import { getUserByIdentifier, updateLastLogin } from '@/lib/db';
import type { LoginResponse } from '@/lib/types/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    // Query user berdasarkan username, email, atau nisn
    let user;
    try {
      user = await getUserByIdentifier(username, role || 'siswa');
      console.log('User lookup:', { username, role: role || 'siswa', found: !!user });
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
      console.log('User not found:', { username, role: role || 'siswa' });
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Verifikasi password
    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, message: 'Data user tidak valid' },
        { status: 500 }
      );
    }

    console.log('Password verification:', { 
      hasPasswordHash: !!user.password_hash,
      passwordHashLength: user.password_hash?.length 
    });
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password match:', isPasswordValid);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Update last login
    try {
      await updateLastLogin(user.id);
    } catch (updateError) {
      // Log error but don't fail login
      console.error('Failed to update last login:', updateError);
    }

    // Hapus password_hash dari response
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

