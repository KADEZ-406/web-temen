import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface Database {
  users: any[];
  guru_bk: any[];
  layanan_bk: any[];
  guru_layanan: any[];
  periode_pemilihan: any[];
  jadwal_konseling: any[];
  history_konseling: any[];
  notifikasi: any[];
  pengaturan_user: any[];
  pengaturan_sistem: any[];
  log_aktivitas: any[];
  laporan_konseling: any[];
  backup_log: any[];
}

const dataDir = join(process.cwd(), 'data');
const filePath = join(dataDir, 'database.json');

const defaultData: Database = {
  users: [],
  guru_bk: [],
  layanan_bk: [],
  guru_layanan: [],
  periode_pemilihan: [],
  jadwal_konseling: [],
  history_konseling: [],
  notifikasi: [],
  pengaturan_user: [],
  pengaturan_sistem: [],
  log_aktivitas: [],
  laporan_konseling: [],
  backup_log: [],
};

let dbCache: Database | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 detik untuk mengurangi I/O operations

function loadDB(): Database {
  const now = Date.now();
  
  if (dbCache && (now - cacheTimestamp) < CACHE_TTL) {
    return dbCache;
  }

  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  if (!existsSync(filePath)) {
    dbCache = JSON.parse(JSON.stringify(defaultData));
    initializeDefaultDataSync();
    saveDB();
    return dbCache!;
  }

  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    
    if (!parsed.users || parsed.users.length === 0) {
      dbCache = JSON.parse(JSON.stringify(defaultData));
      initializeDefaultDataSync();
      saveDB();
    } else {
      dbCache = parsed;
      cacheTimestamp = now;
    }
    
    return dbCache!;
  } catch (error) {
    console.error('Error loading database:', error);
    dbCache = JSON.parse(JSON.stringify(defaultData));
    initializeDefaultDataSync();
    saveDB();
    return dbCache!;
  }
}

function saveDB(): void {
  if (!dbCache) {
    console.error('Error saving database: dbCache is null');
    return;
  }
  try {
    writeFileSync(filePath, JSON.stringify(dbCache, null, 2), 'utf-8');
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('Error saving database:', error);
    throw error;
  }
}

function initializeDefaultDataSync() {
  if (!dbCache) return;
  
  const passwordHash = '$2b$10$JlIXr0ViRhSfjISyfxDcf.aFnFFtwuUL1BrJY9OWVk6uZL10tr4pG';
  
  if (dbCache.users.length === 0) {
    dbCache.users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@smktarunabhakti.sch.id',
        password_hash: passwordHash,
        role: 'admin',
        nama_lengkap: 'Administrator',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        username: 'admin01',
        email: 'admin@smktarunabhakti.sch.id',
        password_hash: passwordHash,
        role: 'admin',
        nama_lengkap: 'Admin BK',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        username: 'siswa001',
        nisn: '1234567890',
        email: 'siswa001@student.smktarunabhakti.sch.id',
        password_hash: passwordHash,
        role: 'siswa',
        nama_lengkap: 'Ahmad Rizki',
        jenis_kelamin: 'L',
        tanggal_lahir: '2007-05-15',
        alamat: 'Jl. Merdeka No. 123, Jakarta',
        no_telepon: '081234567896',
        kelas: 'XII',
        jurusan: 'Teknik Informatika',
        tahun_masuk: 2022,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        username: 'siswa002',
        nisn: '1234567891',
        email: 'siswa002@student.smktarunabhakti.sch.id',
        password_hash: passwordHash,
        role: 'siswa',
        nama_lengkap: 'Siti Nurhaliza',
        jenis_kelamin: 'P',
        tanggal_lahir: '2007-08-20',
        alamat: 'Jl. Sudirman No. 456, Jakarta',
        no_telepon: '081234567897',
        kelas: 'XII',
        jurusan: 'Akuntansi',
        tahun_masuk: 2022,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        username: 'siswa003',
        nisn: '1234567892',
        email: 'siswa003@student.smktarunabhakti.sch.id',
        password_hash: passwordHash,
        role: 'siswa',
        nama_lengkap: 'Budi Santoso',
        jenis_kelamin: 'L',
        tanggal_lahir: '2007-03-10',
        alamat: 'Jl. Gatot Subroto No. 789, Jakarta',
        no_telepon: '081234567898',
        kelas: 'XI',
        jurusan: 'Teknik Mesin',
        tahun_masuk: 2023,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  if (dbCache.layanan_bk.length === 0) {
    dbCache.layanan_bk = [
      {
        id: 1,
        kode_layanan: 'AKADEMIK',
        nama_layanan: 'Konseling Akademik',
        deskripsi: 'Bimbingan untuk masalah akademik dan pembelajaran',
        icon: 'book',
        warna: '#3B82F6',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        kode_layanan: 'KARIR',
        nama_layanan: 'Bimbingan Karir',
        deskripsi: 'Bimbingan untuk perencanaan karir dan masa depan',
        icon: 'briefcase',
        warna: '#10B981',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        kode_layanan: 'PRIBADI',
        nama_layanan: 'Bimbingan Pribadi',
        deskripsi: 'Bimbingan untuk masalah pribadi dan pengembangan diri',
        icon: 'user',
        warna: '#8B5CF6',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        kode_layanan: 'SOSIAL',
        nama_layanan: 'Bimbingan Sosial',
        deskripsi: 'Bimbingan untuk masalah sosial dan hubungan',
        icon: 'users',
        warna: '#F59E0B',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        kode_layanan: 'KELUARGA',
        nama_layanan: 'Konseling Keluarga',
        deskripsi: 'Bimbingan untuk masalah keluarga',
        icon: 'home',
        warna: '#EC4899',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        kode_layanan: 'KESEHATAN',
        nama_layanan: 'Kesehatan Mental',
        deskripsi: 'Bimbingan untuk kesehatan mental dan psikologi',
        icon: 'heart',
        warna: '#EF4444',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  if (dbCache.guru_bk.length === 0) {
    dbCache.guru_bk = [
      {
        id: 1,
        nama_lengkap: 'Ibu Siti Aminah, S.Pd',
        jenis_kelamin: 'P',
        email: 'siti.aminah@smktarunabhakti.sch.id',
        no_telepon: '081234567890',
        spesialisasi: 'Konseling Akademik & Karir',
        pendidikan_terakhir: 'S1 Pendidikan Bimbingan Konseling',
        tahun_mulai_mengajar: 2015,
        bio: 'Berpengalaman lebih dari 8 tahun dalam bimbingan konseling akademik dan karir.',
        foto_profil: 'https://ui-avatars.com/api/?name=Siti+Aminah&size=200&background=3b82f6&color=fff',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        nama_lengkap: 'Bapak Ahmad Fauzi, M.Pd',
        jenis_kelamin: 'L',
        email: 'ahmad.fauzi@smktarunabhakti.sch.id',
        no_telepon: '081234567891',
        spesialisasi: 'Bimbingan Pribadi & Sosial',
        pendidikan_terakhir: 'S2 Bimbingan Konseling',
        tahun_mulai_mengajar: 2012,
        bio: 'Spesialis dalam bimbingan pribadi dan sosial untuk remaja.',
        foto_profil: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&size=200&background=10b981&color=fff',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        nama_lengkap: 'Ibu Dewi Lestari, S.Psi',
        jenis_kelamin: 'P',
        email: 'dewi.lestari@smktarunabhakti.sch.id',
        no_telepon: '081234567892',
        spesialisasi: 'Psikologi & Kesehatan Mental',
        pendidikan_terakhir: 'S1 Psikologi',
        tahun_mulai_mengajar: 2018,
        bio: 'Ahli dalam psikologi remaja dan kesehatan mental.',
        foto_profil: 'https://ui-avatars.com/api/?name=Dewi+Lestari&size=200&background=8b5cf6&color=fff',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        nama_lengkap: 'Bapak Rizki Pratama, S.Pd',
        jenis_kelamin: 'L',
        email: 'rizki.pratama@smktarunabhakti.sch.id',
        no_telepon: '081234567893',
        spesialisasi: 'Pengembangan Diri & Motivasi',
        pendidikan_terakhir: 'S1 Pendidikan Bimbingan Konseling',
        tahun_mulai_mengajar: 2016,
        bio: 'Fokus pada pengembangan diri dan motivasi siswa.',
        foto_profil: 'https://ui-avatars.com/api/?name=Rizki+Pratama&size=200&background=f59e0b&color=fff',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        nama_lengkap: 'Ibu Fitri Handayani, M.Psi',
        jenis_kelamin: 'P',
        email: 'fitri.handayani@smktarunabhakti.sch.id',
        no_telepon: '081234567894',
        spesialisasi: 'Konseling Keluarga',
        pendidikan_terakhir: 'S2 Psikologi',
        tahun_mulai_mengajar: 2014,
        bio: 'Spesialis konseling keluarga dan masalah remaja.',
        foto_profil: 'https://ui-avatars.com/api/?name=Fitri+Handayani&size=200&background=ec4899&color=fff',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        nama_lengkap: 'Bapak Andi Wijaya, S.Pd',
        jenis_kelamin: 'L',
        email: 'andi.wijaya@smktarunabhakti.sch.id',
        no_telepon: '081234567895',
        spesialisasi: 'Bimbingan Karir & Prestasi',
        pendidikan_terakhir: 'S1 Pendidikan Bimbingan Konseling',
        tahun_mulai_mengajar: 2017,
        bio: 'Ahli dalam bimbingan karir dan peningkatan prestasi.',
        foto_profil: 'https://ui-avatars.com/api/?name=Andi+Wijaya&size=200&background=ef4444&color=fff',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  if (dbCache.guru_layanan.length === 0) {
    dbCache.guru_layanan = [
      { id: 1, guru_id: 1, layanan_id: 1 },
      { id: 2, guru_id: 1, layanan_id: 2 },
      { id: 3, guru_id: 2, layanan_id: 3 },
      { id: 4, guru_id: 2, layanan_id: 4 },
      { id: 5, guru_id: 3, layanan_id: 3 },
      { id: 6, guru_id: 3, layanan_id: 6 },
      { id: 7, guru_id: 4, layanan_id: 3 },
      { id: 8, guru_id: 5, layanan_id: 5 },
      { id: 9, guru_id: 6, layanan_id: 2 },
      { id: 10, guru_id: 6, layanan_id: 1 },
    ];
  }

  if (dbCache.pengaturan_sistem.length === 0) {
    dbCache.pengaturan_sistem = [
      { id: 1, kategori: 'notifikasi', key_setting: 'notifikasi_aktif', value_setting: 'true', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 2, kategori: 'notifikasi', key_setting: 'notifikasi_email', value_setting: 'true', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 3, kategori: 'sistem', key_setting: 'backup_otomatis', value_setting: 'true', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 4, kategori: 'sistem', key_setting: 'maintenance_mode', value_setting: 'false', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 5, kategori: 'konseling', key_setting: 'max_sesi_per_hari', value_setting: '10', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 6, kategori: 'konseling', key_setting: 'durasi_sesi_menit', value_setting: '60', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ];
  }
}

function getNextId(collection: any[]): number {
  if (collection.length === 0) return 1;
  const ids = collection.map(item => item.id || 0).filter(id => typeof id === 'number' && id > 0);
  if (ids.length === 0) return 1;
  return Math.max(...ids) + 1;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const db = loadDB();
  
  if (sql.includes('guru_bk') && sql.includes('guru_layanan') && sql.includes('layanan_bk')) {
    let gurus = db.guru_bk.filter(g => !g.deleted_at);
    const guruLayanan = db.guru_layanan;
    const layanan = db.layanan_bk.filter(l => l.is_active);
    
    if (sql.includes('gb.is_active = ?') && params && params.length > 0) {
      const isActiveParam = params.find((p, idx) => {
        const beforeIsActive = sql.substring(0, sql.indexOf('gb.is_active = ?'));
        const questionMarks = (beforeIsActive.match(/\?/g) || []).length;
        return idx === questionMarks;
      });
      
      if (isActiveParam !== undefined) {
        const isActiveValue = isActiveParam === 'true' || isActiveParam === true;
        gurus = gurus.filter(g => g.is_active === isActiveValue);
      }
    }
    
    let result = gurus.map(guru => {
      const layananIds = guruLayanan
        .filter(gl => gl.guru_id === guru.id)
        .map(gl => gl.layanan_id);
      
      const layananNames = layanan
        .filter(l => layananIds.includes(l.id))
        .map(l => l.nama_layanan);
      
      return {
        ...guru,
        layanan: layananNames.join(', '),
      };
    });
    
    return result.sort((a: any, b: any) => a.nama_lengkap.localeCompare(b.nama_lengkap)) as T[];
  }
  
  if (sql.includes('jadwal_konseling') && sql.includes('INNER JOIN')) {
    const jadwal = db.jadwal_konseling.filter(j => !j.deleted_at);
    const users = db.users;
    const gurus = db.guru_bk;
    const layanan = db.layanan_bk;
    
    let result = jadwal.map(j => {
      const siswa = users.find(u => u.id === j.siswa_id);
      const guru = gurus.find(g => g.id === j.guru_id);
      const layananItem = layanan.find(l => l.id === j.layanan_id);
      
      if (params && params.length > 0) {
        let paramIndex = 0;
        let matches = true;
        
        if (sql.includes('jk.siswa_id = ?')) {
          const value = params[paramIndex++];
          const parsedValue = parseInt(String(value), 10);
          if (isNaN(parsedValue) || j.siswa_id !== parsedValue) matches = false;
        }
        if (sql.includes('jk.guru_id = ?')) {
          const value = params[paramIndex++];
          const parsedValue = parseInt(String(value), 10);
          if (isNaN(parsedValue) || j.guru_id !== parsedValue) matches = false;
        }
        if (sql.includes('jk.status = ?')) {
          const value = params[paramIndex++];
          if (j.status !== value) matches = false;
        }
        
        if (!matches) return null;
      }
      
      const resultItem = {
        ...j,
        nama_siswa: siswa?.nama_lengkap || '',
        nisn: siswa?.nisn || '',
        nama_guru: guru?.nama_lengkap || '',
        foto_guru: guru?.foto_profil || '',
        nama_layanan: layananItem?.nama_layanan || '',
        warna: layananItem?.warna || '',
      };
      
      return resultItem;
    }).filter(Boolean);
    
    if (sql.includes('ORDER BY')) {
      if (sql.includes('jk.tanggal DESC') || sql.includes('tanggal DESC')) {
        result = result.sort((a: any, b: any) => {
          const dateA = new Date(`${a.tanggal} ${a.waktu_mulai || '00:00:00'}`).getTime();
          const dateB = new Date(`${b.tanggal} ${b.waktu_mulai || '00:00:00'}`).getTime();
          return dateB - dateA;
        });
      } else if (sql.includes('jk.tanggal ASC') || sql.includes('tanggal ASC')) {
        result = result.sort((a: any, b: any) => {
          const dateA = new Date(`${a.tanggal} ${a.waktu_mulai || '00:00:00'}`).getTime();
          const dateB = new Date(`${b.tanggal} ${b.waktu_mulai || '00:00:00'}`).getTime();
          return dateA - dateB;
        });
      }
    }
    
    return result as T[];
  }
  
  if (sql.includes('SELECT COUNT(*)')) {
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (tableMatch) {
      const table = tableMatch[1] as keyof Database;
      let collection = (db[table] || []) as any[];
      
      collection = collection.filter((item: any) => !item.deleted_at);
      
      if (sql.includes('role = ')) {
        const roleMatch = sql.match(/role\s*=\s*['"]([^'"]+)['"]/i);
        if (roleMatch) {
          collection = collection.filter((item: any) => item.role === roleMatch[1]);
        }
      }

      if (sql.includes('is_active = TRUE') || sql.includes('is_active = true')) {
        collection = collection.filter((item: any) => item.is_active === true);
      }

      if (sql.includes('is_active = ?')) {
        const sqlNormalized = sql.replace(/\s+/g, ' ');
        const beforeIsActive = sqlNormalized.substring(0, sqlNormalized.indexOf('is_active = ?'));
        const questionMarksBefore = (beforeIsActive.match(/\?/g) || []).length;
        if (params && params.length > questionMarksBefore) {
          const isActiveValue = params[questionMarksBefore] === true || params[questionMarksBefore] === 'true';
          collection = collection.filter((item: any) => item.is_active === isActiveValue);
        }
      }

      if (sql.includes('status IN')) {
        const statusMatch = sql.match(/status\s+IN\s*\(([^)]+)\)/i);
        if (statusMatch) {
          const statuses = statusMatch[1].split(',').map((s: string) => s.trim().replace(/['"]/g, ''));
          collection = collection.filter((item: any) => {
            const itemStatus = item.status || 'menunggu';
            return statuses.includes(itemStatus);
          });
        }
      }

      if (sql.includes('tanggal >= ?') && params && params.length > 0) {
        const sqlNormalized = sql.replace(/\s+/g, ' ');
        const beforeTanggal = sqlNormalized.substring(0, sqlNormalized.indexOf('tanggal >= ?'));
        const questionMarksBefore = (beforeTanggal.match(/\?/g) || []).length;
        if (params.length > questionMarksBefore) {
          const tanggalValue = params[questionMarksBefore];
          collection = collection.filter((item: any) => item.tanggal && item.tanggal >= tanggalValue);
        }
      }

      if (sql.includes('tanggal = ?') && params && params.length > 0) {
        const sqlNormalized = sql.replace(/\s+/g, ' ');
        const beforeTanggal = sqlNormalized.substring(0, sqlNormalized.indexOf('tanggal = ?'));
        const questionMarksBefore = (beforeTanggal.match(/\?/g) || []).length;
        if (params.length > questionMarksBefore) {
          const tanggalValue = params[questionMarksBefore];
          collection = collection.filter((item: any) => item.tanggal === tanggalValue);
        }
      }

      if (sql.includes('status = ?') && params && params.length > 0 && !sql.includes('status IN')) {
        const sqlNormalized = sql.replace(/\s+/g, ' ');
        const beforeStatus = sqlNormalized.substring(0, sqlNormalized.indexOf('status = ?'));
        const questionMarksBefore = (beforeStatus.match(/\?/g) || []).length;
        if (params.length > questionMarksBefore) {
          const statusValue = params[questionMarksBefore];
          collection = collection.filter((item: any) => {
            const itemStatus = item.status || 'menunggu';
            return itemStatus === statusValue;
          });
        }
      }
      
      if (params && params.length > 0) {
        collection = collection.filter((item: any) => {
          let matches = true;
          
          if (sql.includes('siswa_id = ?')) {
            const sqlNormalized = sql.replace(/\s+/g, ' ');
            const beforeSiswaId = sqlNormalized.substring(0, sqlNormalized.indexOf('siswa_id = ?'));
            const questionMarksBefore = (beforeSiswaId.match(/\?/g) || []).length;
            if (params.length > questionMarksBefore) {
              const parsedValue = parseInt(String(params[questionMarksBefore]), 10);
              if (isNaN(parsedValue) || item.siswa_id !== parsedValue) {
                matches = false;
              }
            } else {
              matches = false;
            }
          }
          
          if (matches && sql.includes('guru_id = ?')) {
            const sqlNormalized = sql.replace(/\s+/g, ' ');
            const beforeGuruId = sqlNormalized.substring(0, sqlNormalized.indexOf('guru_id = ?'));
            const questionMarksBefore = (beforeGuruId.match(/\?/g) || []).length;
            if (params.length > questionMarksBefore) {
              const parsedValue = parseInt(String(params[questionMarksBefore]), 10);
              if (isNaN(parsedValue) || item.guru_id !== parsedValue) {
                matches = false;
              }
            } else {
              matches = false;
            }
          }
          
          if (matches && sql.match(/status\s*=\s*['"]([^'"]+)['"]/i)) {
            const statusMatch = sql.match(/status\s*=\s*['"]([^'"]+)['"]/i);
            const itemStatus = item.status || 'menunggu';
            if (statusMatch && itemStatus !== statusMatch[1]) {
              matches = false;
            }
          }
          
          return matches;
        });
      }
      
      const countResult = { count: collection.length };
      return [countResult] as T[];
    }
  }

  const tableMatch = sql.match(/FROM\s+(\w+)/i);
  if (tableMatch) {
    const table = tableMatch[1] as keyof Database;
    let collection = (db[table] || []) as any[];
    
    collection = collection.filter((item: any) => !item.deleted_at);
    
    if (params && params.length > 0) {
      let paramIndex = 0;
      collection = collection.filter((item: any) => {
        if (table === 'users' && sql.includes('username = ?') && sql.includes('email = ?')) {
          // Handle query dengan (username = ? OR email = ? OR nisn = ?)
          const identifier = params[paramIndex];
          const identifierMatch = item.username === identifier || 
                                  item.email === identifier || 
                                  (item.nisn && item.nisn === identifier);
          
          if (!identifierMatch) {
            return false;
          }
          
          // Skip 3 parameters (username, email, nisn) karena semua menggunakan identifier yang sama
          paramIndex += 3;
          
          if (sql.includes('is_active = TRUE')) {
            if (!item.is_active) {
              return false;
            }
          }
          
          if (sql.includes('role = ?') && paramIndex < params.length) {
            const role = params[paramIndex++];
            if (item.role !== role) {
              return false;
            }
          }
          
          return true;
        }
        
        if (sql.includes('id = ?') && !sql.includes('username = ?')) {
          if (paramIndex >= params.length) return false;
          const parsedValue = parseInt(String(params[paramIndex++]), 10);
          return !isNaN(parsedValue) && item.id === parsedValue;
        }
        if (sql.includes('user_id = ?')) {
          if (paramIndex >= params.length) return false;
          const parsedValue = parseInt(String(params[paramIndex++]), 10);
          return !isNaN(parsedValue) && item.user_id === parsedValue;
        }
        if (sql.includes('is_active = ?')) {
          const value = params[paramIndex++];
          return item.is_active === (value === 'true' || value === true);
        }
        if (sql.includes('is_read = ?')) {
          const value = params[paramIndex++];
          return item.is_read === (value === 'true' || value === true);
        }
        if (sql.includes('siswa_id = ?')) {
          if (paramIndex >= params.length) return false;
          const parsedValue = parseInt(String(params[paramIndex++]), 10);
          if (isNaN(parsedValue) || item.siswa_id !== parsedValue) return false;
        }
        if (sql.includes('guru_id = ?')) {
          if (paramIndex >= params.length) return false;
          const parsedValue = parseInt(String(params[paramIndex++]), 10);
          if (isNaN(parsedValue) || item.guru_id !== parsedValue) return false;
        }
        if (sql.includes('status = ?') && !sql.includes('status IN')) {
          const matches = item.status === params[paramIndex++];
          if (!matches) return false;
        }
        if (sql.includes('tanggal = ?')) {
          const tanggal = params[paramIndex++];
          if (item.tanggal !== tanggal) return false;
        }
        if (sql.includes('tanggal >= ?')) {
          const tanggal = params[paramIndex++];
          if (item.tanggal < tanggal) return false;
        }
        if (sql.includes('role = ?') && !sql.includes('username = ?')) {
          const matches = item.role === params[paramIndex++];
          if (!matches) return false;
        }
        return true;
      });
      
      if (sql.includes('status IN')) {
        const statusMatch = sql.match(/status IN \(([^)]+)\)/i);
        if (statusMatch) {
          const statuses = statusMatch[1].split(',').map((s: string) => s.trim().replace(/['"]/g, ''));
          collection = collection.filter((item: any) => statuses.includes(item.status));
        }
      }
    }
    
    if (sql.includes('ORDER BY')) {
      const orderMatch = sql.match(/ORDER BY\s+(\w+\.?\w*)\s+(ASC|DESC)?/i);
      if (orderMatch) {
        const field = orderMatch[1].split('.').pop() || orderMatch[1];
        const direction = orderMatch[2]?.toUpperCase() || 'ASC';
        collection.sort((a: any, b: any) => {
          const aVal = a[field];
          const bVal = b[field];
          if (direction === 'DESC') {
            return bVal > aVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }
    }
    
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      collection = collection.slice(0, limit);
    }
    
    return collection as T[];
  }
  
  return [];
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

export async function execute(sql: string, params?: any[]): Promise<any> {
  const db = loadDB();
  
  if (sql.toUpperCase().startsWith('INSERT')) {
    const tableMatch = sql.match(/INTO\s+(\w+)/i);
    if (!tableMatch) throw new Error('Invalid INSERT statement');
    
    const table = tableMatch[1] as keyof Database;
    const collection = db[table] as any[];
    
    if (!collection || !Array.isArray(collection)) {
      throw new Error(`Invalid table: ${table}`);
    }
    
    const columnsMatch = sql.match(/\(([^)]+)\)/);
    if (!columnsMatch) throw new Error('Invalid INSERT columns');
    
    const columns = columnsMatch[1].split(',').map(c => c.trim());
    const newItem: any = {
      id: getNextId(collection),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    if (params) {
      columns.forEach((col, idx) => {
        if (params[idx] !== undefined && params[idx] !== null) {
          newItem[col] = params[idx];
        }
      });
    }
    
    collection.push(newItem);
    saveDB();
    return { insertId: newItem.id, affectedRows: 1 };
  }
  
  if (sql.toUpperCase().startsWith('UPDATE')) {
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (!tableMatch) throw new Error('Invalid UPDATE statement');
    
    const table = tableMatch[1] as keyof Database;
    const collection = db[table] as any[];
    
    if (!collection || !Array.isArray(collection)) {
      throw new Error(`Invalid table: ${table}`);
    }
    
    const setMatch = sql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|$)/i);
    
    if (!setMatch) throw new Error('Invalid UPDATE SET clause');
    
    const setFields: any = {};
    const setClause = setMatch[1];
    const setParts = setClause.split(',').map(s => s.trim());
    
    let setParamIndex = 0;
    setParts.forEach(part => {
      const [key, value] = part.split('=').map(s => s.trim());
      if (value === 'NOW()') {
        setFields[key] = new Date().toISOString();
      } else if (value === '?') {
        if (params && params[setParamIndex] !== undefined) {
          setFields[key] = params[setParamIndex];
          setParamIndex++;
        }
      } else {
        setFields[key] = value.replace(/['"]/g, '');
      }
    });
    
    const setQuestionMarks = (setClause.match(/\?/g) || []).length;
    const whereParamIndex = setQuestionMarks;
    
    let updated = 0;
    collection.forEach((item: any) => {
      if (item.deleted_at) return;
      
      let matches = true;
      if (whereMatch && params) {
        const condition = whereMatch[1];
        let currentWhereParamIndex = whereParamIndex;
        
        // Handle multiple WHERE conditions
        if (condition.includes('id = ?')) {
          const beforeId = condition.substring(0, condition.indexOf('id = ?'));
          const questionMarksBefore = (beforeId.match(/\?/g) || []).length;
          currentWhereParamIndex = whereParamIndex + questionMarksBefore;
          if (params.length > currentWhereParamIndex) {
            const parsedValue = parseInt(String(params[currentWhereParamIndex]), 10);
            matches = !isNaN(parsedValue) && item.id === parsedValue;
          } else {
            matches = false;
          }
        } else if (condition.includes('user_id = ?')) {
          const beforeUserId = condition.substring(0, condition.indexOf('user_id = ?'));
          const questionMarksBefore = (beforeUserId.match(/\?/g) || []).length;
          currentWhereParamIndex = whereParamIndex + questionMarksBefore;
          if (params.length > currentWhereParamIndex) {
            const parsedValue = parseInt(String(params[currentWhereParamIndex]), 10);
            matches = !isNaN(parsedValue) && item.user_id === parsedValue;
          } else {
            matches = false;
          }
        } else if (condition.includes('key_setting = ?')) {
          const beforeKeySetting = condition.substring(0, condition.indexOf('key_setting = ?'));
          const questionMarksBefore = (beforeKeySetting.match(/\?/g) || []).length;
          currentWhereParamIndex = whereParamIndex + questionMarksBefore;
          if (params.length > currentWhereParamIndex) {
            matches = item.key_setting === params[currentWhereParamIndex];
          } else {
            matches = false;
          }
        }
      }
      
      if (matches) {
        Object.assign(item, setFields);
        if (!setFields.updated_at) {
          item.updated_at = new Date().toISOString();
        }
        updated++;
      }
    });
    
    saveDB();
    return { affectedRows: updated };
  }
  
  return { affectedRows: 0 };
}

// Functions getUserByIdentifier, updateLastLogin, getAllSiswa, dan searchUsers 
// telah dipindahkan ke lib/db/users.ts untuk menghindari duplicate exports

loadDB();
