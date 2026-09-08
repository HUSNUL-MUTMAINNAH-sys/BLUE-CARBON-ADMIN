import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { getAllLahan } from '../../services/api';
import './lahan.css';

// Wilayah seluruh data lahan pada sistem ini sudah pasti berada di wilayah berikut.
// Tidak ditampilkan sebagai input yang bisa diubah admin — hanya informasi read-only.
const WILAYAH_KELURAHAN = 'Lembang';
const WILAYAH_KECAMATAN = 'Bantaeng';

// Daftar lokasi yang sudah tersedia pada sistem (data lahan.json / database).
// Jika suatu saat ada lokasi baru yang sudah tersimpan di database, akan otomatis
// ditambahkan ke pilihan dropdown ini (lihat useEffect di bawah).
const DEFAULT_LOKASI_OPTIONS = ['Tamalange', 'Ribingkassi', 'Ujunglabbu'];

const GELOMBANG_OPTIONS = ['Tenang', 'Tenang - Sedang', 'Sedang', 'Tinggi'];

const JENIS_BUDIDAYA_OPTIONS = ['Pembudidaya Rumput Laut', 'Pemilik', 'Pekerja Budidaya'];

export default function LahanForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    // A. Informasi Lahan
    lokasi: '',
    pembudidaya: '',
    jenisPelaku: '',
    luas: '',
    status: 'Aktif',
    // B. Foto & Lokasi
    foto: '',
    latitude: '',
    longitude: '',
    // C. Informasi Lokasi
    akses: '',
    kedalaman: '',
    jarakDariPantai: '',
    gelombang: '',
    // D. Deskripsi & Keunggulan
    deskripsi: '',
    // E. Data Produksi
    jumlahBentangan: '',
    panjangBentangan: '',
    siklusPanen: '',
    jenisBibit: ''
  });

  const [lokasiOptions, setLokasiOptions] = useState(DEFAULT_LOKASI_OPTIONS);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Ambil daftar lokasi yang sudah benar-benar tersimpan di database, lalu gabungkan
  // dengan daftar lokasi default. Ini memastikan dropdown selalu menampilkan data
  // aktual tanpa membuat tabel/daftar lokasi baru yang terpisah.
  useEffect(() => {
    async function loadLokasiFromDatabase() {
      try {
        const data = await getAllLahan();
        const existing = data
          .map((l) => l.lokasi)
          .filter((lokasi) => !!lokasi);
        const merged = Array.from(new Set([...DEFAULT_LOKASI_OPTIONS, ...existing]));
        setLokasiOptions(merged);
      } catch (error) {
        // Jika gagal memuat, tetap gunakan daftar default
        console.error('Error loading daftar lokasi:', error);
      }
    }

    loadLokasiFromDatabase();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        luas: initialData.luas?.toString() ?? '',
        latitude: initialData.latitude?.toString() ?? '',
        longitude: initialData.longitude?.toString() ?? '',
        jumlahBentangan: initialData.jumlahBentangan?.toString() || '',
        panjangBentangan: initialData.panjangBentangan?.toString() || '',
        siklusPanen: initialData.siklusPanen?.toString() || '',
        jenisBibit: initialData.jenisBibit || '',
        akses: initialData.akses || '',
        kedalaman: initialData.kedalaman || '',
        jarakDariPantai: initialData.jarakDariPantai || '',
        gelombang: initialData.gelombang || '',
        jenisPelaku: initialData.jenisPelaku || ''
      }));
      // Set preview jika ada foto existing
      if (initialData.foto) {
        setPhotoPreview(initialData.foto);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
      }
      
      // Validasi ukuran (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung geolocation!');
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setIsGettingLocation(false);
        alert('Lokasi berhasil diambil!');
      },
      (error) => {
        setIsGettingLocation(false);
        let message = 'Gagal mengambil lokasi. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message += 'Izin lokasi ditolak. Mohon aktifkan izin lokasi di browser Anda.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Informasi lokasi tidak tersedia.';
            break;
          case error.TIMEOUT:
            message += 'Permintaan lokasi timeout.';
            break;
          default:
            message += 'Terjadi kesalahan yang tidak diketahui.';
        }
        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi field wajib
    const requiredMissing = [];
    if (!formData.lokasi) requiredMissing.push('Lokasi');
    if (!formData.pembudidaya) requiredMissing.push('Pembudidaya');
    if (!formData.jenisPelaku) requiredMissing.push('Jenis Budidaya');
    if (formData.luas === '' || formData.luas === null) requiredMissing.push('Luas Area');
    if (!formData.status) requiredMissing.push('Status');
    if (formData.latitude === '' || formData.latitude === null) requiredMissing.push('Latitude');
    if (formData.longitude === '' || formData.longitude === null) requiredMissing.push('Longitude');

    if (requiredMissing.length > 0) {
      alert(`Mohon lengkapi field wajib berikut: ${requiredMissing.join(', ')}`);
      return;
    }

    // Validasi angka
    if (isNaN(parseFloat(formData.luas)) || parseFloat(formData.luas) <= 0) {
      alert('Luas Area harus berupa angka positif!');
      return;
    }
    if (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude))) {
      alert('Latitude dan Longitude harus berupa angka yang valid!');
      return;
    }

    // Parse data numerik - database menyimpan nilai mentah (angka), bukan string berformat
    const submittedData = {
      ...formData,
      luas: parseFloat(formData.luas) || 0,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
      jumlahBentangan: formData.jumlahBentangan === '' ? '' : parseInt(formData.jumlahBentangan) || 0,
      panjangBentangan: formData.panjangBentangan === '' ? '' : parseFloat(formData.panjangBentangan) || 0,
      siklusPanen: formData.siklusPanen === '' ? '' : parseInt(formData.siklusPanen) || 0
    };

    // Jika ada file foto, convert ke base64
    if (photoFile) {
      submittedData.foto = photoPreview;
    }

    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="lahan-form glass-panel">
      {/* A. INFORMASI LAHAN */}
      <div className="form-section">
        <h3 className="section-title">Informasi Lahan</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="lokasi">Lokasi *</label>
            <select
              id="lokasi"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Lokasi</option>
              {lokasiOptions.map((lokasi) => (
                <option key={lokasi} value={lokasi}>{lokasi}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pembudidaya">Pembudidaya *</label>
            <input
              type="text"
              id="pembudidaya"
              name="pembudidaya"
              value={formData.pembudidaya}
              onChange={handleChange}
              required
              placeholder="Contoh: Ahmad Dg. Ngawa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jenisPelaku">Jenis Budidaya *</label>
            <select
              id="jenisPelaku"
              name="jenisPelaku"
              value={formData.jenisPelaku}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis Budidaya</option>
              {JENIS_BUDIDAYA_OPTIONS.map((jenis) => (
                <option key={jenis} value={jenis}>{jenis}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="luas">Luas Area (m²) *</label>
            <input
              type="number"
              id="luas"
              name="luas"
              value={formData.luas}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="Masukkan dalam hektar (ha). Contoh: 0.75 = 7.500 m²"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Wilayah</label>
            <div className="readonly-box">
              {WILAYAH_KELURAHAN}, Kecamatan {WILAYAH_KECAMATAN}
            </div>
            <small style={{ display: 'block', marginTop: '0.4rem', color: 'var(--text-gray)' }}>
              Seluruh data lahan berada di wilayah ini. Tidak dapat diubah.
            </small>
          </div>
        </div>
      </div>

      <hr className="form-divider" />

      {/* B. FOTO & LOKASI */}
      <div className="form-section">
        <h3 className="section-title">Foto & Lokasi</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="foto">Foto Utama</label>
            <input
              type="file"
              id="foto"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ 
                padding: '0.5rem',
                border: '1px solid var(--border-gray)',
                borderRadius: '8px',
                width: '100%'
              }}
            />
            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-gray)' }}>
              Upload foto utama lahan (maksimal 5MB)
            </small>
            {photoPreview && (
              <div style={{ marginTop: '1rem' }}>
                <img src={photoPreview} alt="Preview Lahan" className="image-preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude *</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="0.000001"
              placeholder="Contoh: -5.552"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude *</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="0.000001"
              placeholder="Contoh: 119.952"
            />
          </div>

          <div className="form-group full-width">
            <Button 
              type="button" 
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              style={{
                background: 'var(--info-color)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              📍 {isGettingLocation ? 'Mengambil lokasi...' : 'Ambil Lokasi Saya'}
            </Button>
          </div>
        </div>
      </div>

      <hr className="form-divider" />

      {/* C. INFORMASI LOKASI */}
      <div className="form-section">
        <h3 className="section-title">Informasi Lokasi</h3>
        <div className="form-grid cols-3">
          <div className="form-group">
            <label htmlFor="akses">Akses</label>
            <input
              type="text"
              id="akses"
              name="akses"
              value={formData.akses}
              onChange={handleChange}
              placeholder="Contoh: Dapat diakses melalui jalan utama dan jalur laut"
            />
          </div>

          <div className="form-group">
            <label htmlFor="kedalaman">Kedalaman</label>
            <input
              type="text"
              id="kedalaman"
              name="kedalaman"
              value={formData.kedalaman}
              onChange={handleChange}
              placeholder="Contoh: 2 – 5 meter"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jarakDariPantai">Jarak dari Pantai</label>
            <input
              type="text"
              id="jarakDariPantai"
              name="jarakDariPantai"
              value={formData.jarakDariPantai}
              onChange={handleChange}
              placeholder="Contoh: ± 150 meter"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="gelombang">Gelombang</label>
            <select
              id="gelombang"
              name="gelombang"
              value={formData.gelombang}
              onChange={handleChange}
            >
              <option value="">Pilih Kondisi Gelombang</option>
              {GELOMBANG_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <hr className="form-divider" />

      {/* D. DESKRIPSI & KEUNGGULAN */}
      <div className="form-section">
        <h3 className="section-title">Deskripsi & Keunggulan</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="deskripsi">Deskripsi & Keunggulan Lokasi</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Contoh: Area budidaya rumput laut di sisi utara pesisir, berdekatan dengan permukiman nelayan dan akses jalan utama."
              rows="3"
            />
          </div>
        </div>
      </div>

      <hr className="form-divider" />

      {/* E. DATA PRODUKSI */}
      <div className="form-section">
        <h3 className="section-title">Data Produksi</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="jumlahBentangan">Jumlah Bentangan Tali (unit)</label>
            <input
              type="number"
              id="jumlahBentangan"
              name="jumlahBentangan"
              value={formData.jumlahBentangan}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 120"
            />
          </div>

          <div className="form-group">
            <label htmlFor="panjangBentangan">Panjang Tali Bentangan (meter)</label>
            <input
              type="number"
              id="panjangBentangan"
              name="panjangBentangan"
              value={formData.panjangBentangan}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Contoh: 25"
            />
          </div>

          <div className="form-group">
            <label htmlFor="siklusPanen">Siklus Panen (kali/tahun)</label>
            <input
              type="number"
              id="siklusPanen"
              name="siklusPanen"
              value={formData.siklusPanen}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 2 (artinya 2 x setahun)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jenisBibit">Jenis Bibit</label>
            <input
              type="text"
              id="jenisBibit"
              name="jenisBibit"
              value={formData.jenisBibit}
              onChange={handleChange}
              placeholder="Contoh: Eucheuma cottonii"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : initialData ? 'Update' : 'Simpan Data'}
        </Button>
      </div>
    </form>
  );
}
