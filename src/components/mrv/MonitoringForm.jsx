import { useState, useEffect, useMemo } from 'react';
import Button from '../common/Button';
import { getAllLahan } from '../../services/api';
import '../lahan/lahan.css';
import './mrv.css';

export default function MonitoringForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [lahanList, setLahanList] = useState([]);
  const [loadingLahan, setLoadingLahan] = useState(true);

  const [formData, setFormData] = useState({
    owner: '',
    land_id: '',
    monitoring_date: '',
    production: '',
    revenue: '',
  });

  // Ambil daftar lahan yang sudah tersimpan di database (sumber kebenaran untuk relasi Pemilik -> Lahan)
  useEffect(() => {
    async function loadLahan() {
      try {
        const data = await getAllLahan();
        setLahanList(data);
      } catch (error) {
        console.error('Error loading daftar lahan:', error);
      } finally {
        setLoadingLahan(false);
      }
    }

    loadLahan();
  }, []);

  // Daftar nama pemilik lahan yang unik, diambil dari Data Lahan (bukan hardcode)
  const ownerOptions = useMemo(() => {
    const seen = new Set();
    const owners = [];
    lahanList.forEach((l) => {
      if (l.pembudidaya && !seen.has(l.pembudidaya)) {
        seen.add(l.pembudidaya);
        owners.push(l.pembudidaya);
      }
    });
    return owners;
  }, [lahanList]);

  // Saat data lahan sudah termuat & sedang mode edit, tentukan pemilik & lahan dari land_id yang tersimpan
  useEffect(() => {
    if (initialData && lahanList.length > 0) {
      const currentLahan = lahanList.find((l) => l.id === parseInt(initialData.land_id));
      setFormData({
        owner: currentLahan?.pembudidaya || '',
        land_id: initialData.land_id?.toString() ?? '',
        monitoring_date: initialData.monitoring_date ? initialData.monitoring_date.slice(0, 10) : '',
        production: initialData.production?.toString() ?? '',
        revenue: initialData.revenue?.toString() ?? '',
      });
    }
  }, [initialData, lahanList]);

  const selectedLahan = lahanList.find((l) => l.id === parseInt(formData.land_id));

  const handleOwnerChange = (e) => {
    const owner = e.target.value;
    // Lokasi diambil otomatis dari relasi ID Lahan milik pemilik ini (Data Lahan),
    // bukan dipilih manual oleh admin. Jika satu pemilik memiliki lebih dari satu
    // lahan, ambil lahan pertama yang terdaftar sebagai lahan aktifnya.
    const matches = lahanList.filter((l) => l.pembudidaya === owner);

    setFormData((prev) => ({
      ...prev,
      owner,
      land_id: matches.length > 0 ? matches[0].id.toString() : '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredMissing = [];
    if (!formData.owner) requiredMissing.push('Pemilik Lahan');
    if (formData.owner && !formData.land_id) requiredMissing.push('Lokasi Lahan');
    if (!formData.monitoring_date) requiredMissing.push('Tanggal Monitoring');
    if (formData.production === '' || formData.production === null) requiredMissing.push('Produksi');
    if (formData.revenue === '' || formData.revenue === null) requiredMissing.push('Penghasilan Panen');

    if (requiredMissing.length > 0) {
      alert(`Mohon lengkapi field wajib berikut: ${requiredMissing.join(', ')}`);
      return;
    }

    if (isNaN(parseFloat(formData.production)) || parseFloat(formData.production) <= 0) {
      alert('Produksi harus berupa angka positif!');
      return;
    }

    if (isNaN(parseFloat(formData.revenue)) || parseFloat(formData.revenue) <= 0) {
      alert('Penghasilan Panen harus berupa angka positif!');
      return;
    }

    if (isNaN(new Date(formData.monitoring_date).getTime())) {
      alert('Tanggal monitoring tidak valid!');
      return;
    }

    onSubmit({
      land_id: parseInt(formData.land_id),
      monitoring_date: formData.monitoring_date,
      production: parseFloat(formData.production),
      revenue: parseFloat(formData.revenue),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="lahan-form glass-panel">
      <div className="form-section">
        <h3 className="section-title">Informasi Monitoring</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="owner">Pemilik Lahan *</label>
            <select
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleOwnerChange}
              required
              disabled={loadingLahan}
            >
              <option value="">{loadingLahan ? 'Memuat data pemilik...' : 'Pilih Pemilik Lahan'}</option>
              {ownerOptions.map((owner) => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="land_id">Lokasi Lahan</label>
            <div className="mrv-owner-readonly">
              {selectedLahan ? selectedLahan.lokasi : '-'}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="monitoring_date">Tanggal Monitoring *</label>
            <input
              type="date"
              id="monitoring_date"
              name="monitoring_date"
              value={formData.monitoring_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="production">Produksi (kg) *</label>
            <input
              type="number"
              id="production"
              name="production"
              value={formData.production}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="Contoh: 1.96"
            />
          </div>

          <div className="form-group">
            <label htmlFor="revenue">Penghasilan Panen (Rp) *</label>
            <input
              type="number"
              id="revenue"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              required
              step="1"
              min="0"
              placeholder="Contoh: 1250000"
            />
          </div>

        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan MRV'}
        </Button>
      </div>
    </form>
  );
}
