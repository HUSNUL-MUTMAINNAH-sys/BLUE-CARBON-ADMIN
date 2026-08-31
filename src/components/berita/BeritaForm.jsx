import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import './berita.css';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function BeritaForm({ initialData, onSubmit, onCancel, isLoading, backTo }) {
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: todayIso(),
    penulis: '',
    status: 'Publish',
    gambar: '',
    konten: '',
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        tanggal: initialData.tanggal ? initialData.tanggal.slice(0, 10) : todayIso(),
      }));
      if (initialData.gambar) {
        setImagePreview(initialData.gambar);
      }
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Format gambar harus JPG atau PNG!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, gambar: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImagePreview('');
    setFormData((prev) => ({ ...prev, gambar: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.judul || !formData.tanggal || !formData.penulis || !formData.gambar || !formData.konten) {
      alert('Mohon lengkapi semua kolom wajib (bertanda *), termasuk gambar berita!');
      return;
    }

    onSubmit(formData);
  }

  return (
    <>
      {backTo && (
        <Link to={backTo} className="berita-back-btn" aria-label="Kembali">
          ←
        </Link>
      )}

      <form onSubmit={handleSubmit} className="berita-form glass-panel">
        <div className="berita-form-grid">
          <div className="berita-form-group">
            <label htmlFor="judul">Judul Berita *</label>
            <input
              type="text"
              id="judul"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              placeholder="Masukkan judul berita"
              required
            />
          </div>

          <div className="berita-form-group">
            <label htmlFor="tanggal">Tanggal *</label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="berita-form-group">
            <label htmlFor="penulis">Penulis *</label>
            <input
              type="text"
              id="penulis"
              name="penulis"
              value={formData.penulis}
              onChange={handleChange}
              placeholder="Nama penulis"
              required
            />
          </div>

          <div className="berita-form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Publish">Publish</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="berita-form-group">
            <label htmlFor="gambar">Upload Gambar *</label>
            <label htmlFor="gambar" className="berita-image-upload">
              <input
                type="file"
                id="gambar"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
              />
              <span className="berita-image-upload-icon">⤴</span>
              Klik untuk upload gambar
              <br />
              <small>Format: JPG, PNG (Maks. 5MB)</small>
            </label>
            {imagePreview && (
              <div className="berita-image-preview-wrap">
                <img src={imagePreview} alt="Preview" className="berita-image-preview" />
                <button
                  type="button"
                  className="berita-image-remove"
                  onClick={handleRemoveImage}
                  aria-label="Hapus gambar"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="berita-form-group full-width">
          <label htmlFor="konten">Isi Berita *</label>
          <textarea
            id="konten"
            name="konten"
            rows="8"
            value={formData.konten}
            onChange={handleChange}
            placeholder="Tulis isi berita di sini..."
            required
          />
        </div>

        <div className="berita-form-actions">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Berita'}
          </Button>
        </div>
      </form>
    </>
  );
}
