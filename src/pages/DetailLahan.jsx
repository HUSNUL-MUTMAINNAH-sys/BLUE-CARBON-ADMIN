import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { getLahanById } from '../services/api';

export default function DetailLahan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lahan, setLahan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLahan() {
      try {
        const data = await getLahanById(id);
        setLahan(data);
      } catch (error) {
        console.error('Error loading lahan:', error);
        alert('Gagal memuat data lahan');
        navigate('/data-lahan');
      } finally {
        setLoading(false);
      }
    }

    fetchLahan();
  }, [id, navigate]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (!lahan) {
    return (
      <PageContainer>
        <div className="empty-state glass-panel">
          <h3>Data Tidak Ditemukan</h3>
          <p>Lahan yang Anda cari tidak ditemukan.</p>
          <Link to="/data-lahan">
            <Button>Kembali ke Data Lahan</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Detail Lahan</h1>
          <p className="dashboard-subtitle">Informasi lengkap lahan budidaya</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/data-lahan/edit/${lahan.id}`}>
            <Button>Edit Data</Button>
          </Link>
          <Link to="/data-lahan">
            <Button variant="secondary">Kembali</Button>
          </Link>
        </div>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '2rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          <div className="detail-field">
            <label className="detail-label">Pembudidaya</label>
            <div className="detail-value">{lahan.pembudidaya}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Status</label>
            <div>
              <Badge status={lahan.status} />
            </div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Lokasi</label>
            <div className="detail-value">{lahan.lokasi}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Wilayah</label>
            <div className="detail-value">Lembang, Kecamatan Bantaeng</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Jenis Budidaya</label>
            <div className="detail-value">{lahan.jenisPelaku || '-'}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Luas Lahan</label>
            <div className="detail-value">{lahan.luas} ha</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Siklus Panen (tahun)</label>
            <div className="detail-value">{lahan.siklusPanen ?? lahan.siklus ?? '-'}</div>
          </div>

          {lahan.gelombang && (
            <div className="detail-field">
              <label className="detail-label">Gelombang</label>
              <div className="detail-value">{lahan.gelombang}</div>
            </div>
          )}

          {lahan.kedalaman && (
            <div className="detail-field">
              <label className="detail-label">Kedalaman</label>
              <div className="detail-value">{lahan.kedalaman}</div>
            </div>
          )}

          {lahan.jarakDariPantai && (
            <div className="detail-field">
              <label className="detail-label">Jarak dari Pantai</label>
              <div className="detail-value">{lahan.jarakDariPantai}</div>
            </div>
          )}

          {lahan.akses && (
            <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
              <label className="detail-label">Akses</label>
              <div className="detail-value">{lahan.akses}</div>
            </div>
          )}

          {lahan.deskripsi && (
            <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
              <label className="detail-label">Deskripsi & Keunggulan Lokasi</label>
              <div className="detail-value" style={{ fontWeight: 400 }}>{lahan.deskripsi}</div>
            </div>
          )}

          <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
            <label className="detail-label">Koordinat</label>
            <div style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--text-dark)' }}>
              Latitude: {lahan.latitude}, Longitude: {lahan.longitude}
            </div>
          </div>

          {lahan.foto && (
            <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
              <label className="detail-label">Foto Lahan</label>
              <img 
                src={lahan.foto} 
                alt={`Lahan ${lahan.pembudidaya}`}
                className="image-preview"
              />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
