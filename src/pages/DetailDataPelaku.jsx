import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { getPelakuById, formatRupiah } from '../services/api';

export default function DetailDataPelaku() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pelaku, setPelaku] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPelaku() {
      try {
        const data = await getPelakuById(id);
        setPelaku(data);
      } catch (error) {
        console.error('Error loading pelaku:', error);
        alert('Gagal memuat data pelaku');
        navigate('/data-pelaku');
      } finally {
        setLoading(false);
      }
    }

    fetchPelaku();
  }, [id, navigate]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (!pelaku) {
    return (
      <PageContainer>
        <div className="empty-state glass-panel">
          <h3>Data Tidak Ditemukan</h3>
          <p>Data pelaku yang Anda cari tidak ditemukan.</p>
          <Link to="/data-pelaku">
            <Button>Kembali ke Data Pelaku</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Detail Data Pelaku</h1>
          <p className="dashboard-subtitle">Informasi lengkap pelaku rumput laut</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/data-pelaku/edit/${pelaku.id}`}>
            <Button>Edit Data</Button>
          </Link>
          <Link to="/data-pelaku">
            <Button variant="secondary">Kembali</Button>
          </Link>
        </div>
      </div>

      <div className="glass-panel" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="detail-field">
            <label className="detail-label">Nama Lengkap</label>
            <div className="detail-value">{pelaku.nama}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Status</label>
            <div><Badge status={pelaku.status} /></div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Jenis Pelaku</label>
            <div className="detail-value">{pelaku.jenisPelaku}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Lokasi / Wilayah</label>
            <div className="detail-value">{pelaku.lokasi}</div>
          </div>

          {pelaku.deskripsi && (
            <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
              <label className="detail-label">Deskripsi</label>
              <div className="detail-value">{pelaku.deskripsi}</div>
            </div>
          )}

          <div className="detail-field">
            <label className="detail-label">Luas Lahan</label>
            <div className="detail-value">{pelaku.luasLahan} ha</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Jumlah Bentangan Tali</label>
            <div className="detail-value">{pelaku.jumlahBentangan} tali</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Siklus Panen</label>
            <div className="detail-value">{pelaku.siklusPanen} bulan</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Estimasi Hasil / Panen</label>
            <div className="detail-value">{pelaku.estimasiHasil} kg</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Jumlah Panen / Tahun</label>
            <div className="detail-value">{pelaku.jumlahPanenTahun}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Estimasi Produksi / Tahun</label>
            <div className="detail-value">{pelaku.estimasiProduksiTahun} kg</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Penghasilan / Panen</label>
            <div className="detail-value">{formatRupiah(pelaku.penghasilanPerPanen || 0)}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Penghasilan / Tahun</label>
            <div className="detail-value">{formatRupiah(pelaku.penghasilanPerTahun || 0)}</div>
          </div>

          {pelaku.sumberPendapatanLain && (
            <div className="detail-field">
              <label className="detail-label">Sumber Pendapatan Lain</label>
              <div className="detail-value">{pelaku.sumberPendapatanLain}</div>
            </div>
          )}

          {pelaku.kontak && (
            <div className="detail-field">
              <label className="detail-label">No. Kontak</label>
              <div className="detail-value">{pelaku.kontak}</div>
            </div>
          )}

          {pelaku.catatan && (
            <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
              <label className="detail-label">Catatan</label>
              <div className="detail-value">{pelaku.catatan}</div>
            </div>
          )}

          {pelaku.foto && (
            <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
              <label className="detail-label">Foto</label>
              <img
                src={pelaku.foto}
                alt={pelaku.nama}
                className="image-preview"
              />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
