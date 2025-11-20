const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Data siswa dari tabel KELAS XI RPL 1
// Format: { USER: '242510044', NAMA: 'Ahmad Faishal Majdii' }
const siswaData = [
  { USER: '242510044', NAMA: 'Ahmad Faishal Majdii' },
  { USER: '242510045', NAMA: 'Algifahri Tri Ramadhan' },
  { USER: '242510046', NAMA: 'Alif AlFathar' },
  // Tambahkan siswa lainnya di sini sesuai tabel
  // { USER: '242510047', NAMA: 'Nama Siswa' },
];

const password = 'Smktb25!';
const passwordHash = '$2b$10$JtrMnYYkqXbNZJ89LfYbXuWFDOqn0M2vbVSBqQ.53nM0r1Ms0tW6i'; // Hash dari Smktb25!

const dbPath = path.join(__dirname, '../data/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Cari ID terakhir
let lastId = Math.max(...db.users.map(u => u.id || 0));

// Tambahkan siswa baru
siswaData.forEach((siswa, index) => {
  // Cek apakah siswa sudah ada
  const existing = db.users.find(u => u.username === siswa.USER || u.nisn === siswa.USER);
  
  if (!existing) {
    lastId++;
    const newSiswa = {
      id: lastId,
      username: siswa.USER,
      nisn: siswa.USER,
      email: `${siswa.USER}@student.smktarunabhakti.sch.id`,
      password_hash: passwordHash,
      role: 'siswa',
      nama_lengkap: siswa.NAMA,
      jenis_kelamin: 'L', // Default, bisa disesuaikan
      tanggal_lahir: '2007-01-01', // Default, bisa disesuaikan
      alamat: 'Jakarta',
      no_telepon: `0812345678${String(index).padStart(2, '0')}`,
      kelas: 'XI',
      jurusan: 'RPL',
      tahun_masuk: 2023,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    db.users.push(newSiswa);
    console.log(`✓ Ditambahkan: ${siswa.NAMA} (${siswa.USER})`);
  } else {
    // Update password jika sudah ada
    existing.password_hash = passwordHash;
    existing.updated_at = new Date().toISOString();
    console.log(`✓ Password diupdate: ${siswa.NAMA} (${siswa.USER})`);
  }
});

// Simpan database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`\n✓ Database berhasil diupdate!`);
console.log(`Total siswa: ${db.users.filter(u => u.role === 'siswa').length}`);

