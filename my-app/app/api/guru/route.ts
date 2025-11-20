import { NextRequest, NextResponse } from 'next/server';
import { query, execute, createUser, usernameExists, emailExists } from '@/lib/db';
import type { ApiResponse, UserCreate, GuruBKCreate } from '@/lib/types/database';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('is_active');

    let sql = `
      SELECT 
        gb.*,
        GROUP_CONCAT(lb.nama_layanan SEPARATOR ', ') as layanan
      FROM guru_bk gb
      LEFT JOIN guru_layanan gl ON gb.id = gl.guru_id
      LEFT JOIN layanan_bk lb ON gl.layanan_id = lb.id
      WHERE gb.deleted_at IS NULL
    `;

    const params: any[] = [];

    if (isActive !== null) {
      sql += ` AND gb.is_active = ?`;
      params.push(isActive === 'true');
    }

    sql += ` GROUP BY gb.id ORDER BY gb.nama_lengkap ASC`;

    const gurus = await query<any>(sql, params);

    const formattedGurus = gurus.map((guru: any) => ({
      ...guru,
      layanan: guru.layanan ? guru.layanan.split(', ') : [],
    }));

    return NextResponse.json({
      success: true,
      data: formattedGurus,
    });
  } catch (error: any) {
    console.error('Get guru error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data guru', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      username,
      password,
      email, 
      nip,
      nama_lengkap, 
      jenis_kelamin, 
      no_telepon, 
      spesialisasi, 
      pendidikan_terakhir, 
      tahun_mulai_mengajar,
      bio,
      current_user_id,
      current_user_role
    } = body;

    if (!current_user_id || !current_user_role) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Autentikasi diperlukan' },
        { status: 401 }
      );
    }

    if (current_user_role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Hanya admin yang dapat menambahkan guru' },
        { status: 403 }
      );
    }

    if (!username || !password || !nama_lengkap || !jenis_kelamin) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Username, password, nama lengkap, dan jenis kelamin harus diisi' },
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

    const password_hash = await bcrypt.hash(password, 10);

    const userData: UserCreate = {
      username,
      password_hash,
      email: email || null,
      role: 'guru',
      nama_lengkap,
      jenis_kelamin: jenis_kelamin as 'L' | 'P',
      is_active: true,
    };

    const userId = await createUser(userData);

    const guruData: GuruBKCreate = {
      user_id: userId,
      nip: nip || null,
      nama_lengkap,
      jenis_kelamin: jenis_kelamin as 'L' | 'P',
      email: email || null,
      no_telepon: no_telepon || null,
      spesialisasi: spesialisasi || null,
      pendidikan_terakhir: pendidikan_terakhir || null,
      tahun_mulai_mengajar: tahun_mulai_mengajar ? parseInt(tahun_mulai_mengajar) : null,
      bio: bio || null,
      is_active: true,
    };

    const result = await execute(
      `INSERT INTO guru_bk (user_id, nip, nama_lengkap, jenis_kelamin, email, no_telepon, spesialisasi, pendidikan_terakhir, tahun_mulai_mengajar, bio, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guruData.user_id,
        guruData.nip,
        guruData.nama_lengkap,
        guruData.jenis_kelamin,
        guruData.email,
        guruData.no_telepon,
        guruData.spesialisasi,
        guruData.pendidikan_terakhir,
        guruData.tahun_mulai_mengajar,
        guruData.bio,
        guruData.is_active,
      ]
    );

    return NextResponse.json<ApiResponse<{ id: number; user_id: number }>>({
      success: true,
      message: 'Guru berhasil ditambahkan',
      data: { id: result.insertId, user_id: userId },
    });
  } catch (error: any) {
    console.error('Create guru error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Gagal menambahkan guru', error: error.message },
      { status: 500 }
    );
  }
}

