import { useState, useEffect } from 'react';
import Button from '../common/Button';
import './pelaku.css';

const LOKASI_OPTIONS = ['Tamalangnge', 'Biring Kassi'];

export default function PelakuForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    nama: '',
    jenisPelaku: '',
    lokasi: '',
    deskripsi: '',
    foto: '',
    luasLahan: '',
    jumlahBentangan: '',
    siklusPanen: '',
    estimasiHasil: '',
    jumlahPanenTahun: '',
    estimasiProduksiTahun: '',
    penghasilanPerPanen: '',
    penghasilanPerTahun: '',
    sumberPendapatanLain: '',
    kontak: '',
    catatan: '',
    status: 'Aktif',
  });

  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if (initialData.foto) {
        setPhotoPreview(initialData.foto);
      }
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setFormData((prev) => ({ ...prev, foto: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setPhotoPreview('');
    setFormData((prev) => ({ ...prev, foto: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.nama || !formData.jenisPelaku || !formData.lokasi) {
      alert('Nama Lengkap, Jenis Pelaku, dan Lokasi/Wilayah wajib diisi!');
      return;
    }

    const submitted = {
      ...formData,
      luasLahan: parseFloat(formData.luasLahan) || 0,
      jumlahBentangan: parseInt(formData.jumlahBentangan) || 0,
      siklusPanen: parseInt(formData.siklusPanen) || 0,
      estimasiHasil: parseFloat(formData.estimasiHasil) || 0,
      jumlahPanenTahun: parseInt(formData.jumlahPanenTahun) || 0,
      estimasiProduksiTahun: parseFloat(formData.estimasiProduksiTahun) || 0,
      penghasilanPerPanen: parseFloat(formData.penghasilanPerPanen) || 0,
      penghasilanPerTahun: parseFloat(formData.penghasilanPerTahun) || 0,
    };

    onSubmit(submitted);
  }

  return (
    <form onSubmit={handleSubmit} className="pelaku-form glass-panel">
      <div className="pelaku-form-section">
        <h3 className="pelaku-section-title">Identitas Pelaku</h3>
        <div className="pelaku-form-grid">
          <div className="pelaku-form-group">
            <label htmlFor="nama">Nama Lengkap *</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Contoh: Ahmad Dg. Ngawa"
              required
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="jenisPelaku">Jenis Pelaku *</label>
            <select
              id="jenisPelaku"
              name="jenisPelaku"
              value={formData.jenisPelaku}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis</option>
              <option value="Nelayan">Nelayan</option>
              <option value="Pembudidaya Rumput Laut">Pembudidaya Rumput Laut</option>
            </select>
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="lokasi">Lokasi / Wilayah *</label>
            <select
              id="lokasi"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Lokasi</option>
              {LOKASI_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="pelaku-form-group full-width">
            <label htmlFor="deskripsi">Deskripsi (Opsional)</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="3"
              placeholder="Deskripsi singkat tentang pelaku"
            />
          </div>

          <div className="pelaku-form-group full-width">
            <label htmlFor="foto">Foto</label>
            <label htmlFor="foto" className="pelaku-photo-upload">
              <input
                type="file"
                id="foto"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              Klik untuk upload foto
              <br />
              <small>PNG, JPG (maks. 2MB)</small>
            </label>
            {photoPreview && (
              <div className="pelaku-photo-preview-wrap">
                <img src={photoPreview} alt="Preview" className="pelaku-photo-preview" />
                <button
                  type="button"
                  className="pelaku-photo-remove"
                  onClick={handleRemovePhoto}
                  aria-label="Hapus foto"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="pelaku-section-divider" />

      <div className="pelaku-form-section">
        <h3 className="pelaku-section-title">Data Lahan & Produksi</h3>
        <div className="pelaku-form-grid cols-3">
          <div className="pelaku-form-group">
            <label htmlFor="luasLahan">Luas Lahan (ha)</label>
            <input
              type="number"
              id="luasLahan"
              name="luasLahan"
              value={formData.luasLahan}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="Contoh: 0.75"
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="jumlahBentangan">Jumlah Bentangan Tali (Tali)</label>
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

          <div className="pelaku-form-group">
            <label htmlFor="siklusPanen">Siklus Panen (Bulan)</label>
            <input
              type="number"
              id="siklusPanen"
              name="siklusPanen"
              value={formData.siklusPanen}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 2"
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="estimasiHasil">Estimasi Hasil / Panen (kg)</label>
            <input
              type="number"
              id="estimasiHasil"
              name="estimasiHasil"
              value={formData.estimasiHasil}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 500"
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="jumlahPanenTahun">Jumlah Panen / Tahun</label>
            <input
              type="number"
              id="jumlahPanenTahun"
              name="jumlahPanenTahun"
              value={formData.jumlahPanenTahun}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 4"
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="estimasiProduksiTahun">Estimasi Produksi / Tahun (kg)</label>
            <input
              type="number"
              id="estimasiProduksiTahun"
              name="estimasiProduksiTahun"
              value={formData.estimasiProduksiTahun}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 2000"
            />
          </div>
        </div>
      </div>

      <hr className="pelaku-section-divider" />

      <div className="pelaku-form-section">
        <h3 className="pelaku-section-title">Data Ekonomi</h3>
        <div className="pelaku-form-grid">
          <div className="pelaku-form-group">
            <label htmlFor="penghasilanPerPanen">Penghasilan / Panen (Rp)</label>
            <input
              type="number"
              id="penghasilanPerPanen"
              name="penghasilanPerPanen"
              value={formData.penghasilanPerPanen}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 5000000"
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="penghasilanPerTahun">Penghasilan / Tahun (Rp)</label>
            <input
              type="number"
              id="penghasilanPerTahun"
              name="penghasilanPerTahun"
              value={formData.penghasilanPerTahun}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 20000000"
            />
          </div>
        </div>
      </div>

      <hr className="pelaku-section-divider" />

      <div className="pelaku-form-section">
        <h3 className="pelaku-section-title">Informasi Lainnya</h3>
        <div className="pelaku-form-grid cols-3">
          <div className="pelaku-form-group">
            <label htmlFor="sumberPendapatanLain">Sumber Pendapatan Lain (Opsional)</label>
            <input
              type="text"
              id="sumberPendapatanLain"
              name="sumberPendapatanLain"
              value={formData.sumberPendapatanLain}
              onChange={handleChange}
              placeholder="Contoh: Jual hasil tangkapan, dll"
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="kontak">No. Kontak (Opsional)</label>
            <input
              type="text"
              id="kontak"
              name="kontak"
              value={formData.kontak}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
            />
          </div>

          <div className="pelaku-form-group">
            <label htmlFor="catatan">Catatan (Opsional)</label>
            <input
              type="text"
              id="catatan"
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              placeholder="Catatan tambahan"
            />
          </div>
        </div>
      </div>

      <hr className="pelaku-section-divider" />

      <div className="pelaku-form-section">
        <h3 className="pelaku-section-title">Status</h3>
        <div className="pelaku-form-grid">
          <div className="pelaku-form-group">
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
        </div>
      </div>

      <div className="pelaku-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Data'}
        </Button>
      </div>
    </form>
  );
}
