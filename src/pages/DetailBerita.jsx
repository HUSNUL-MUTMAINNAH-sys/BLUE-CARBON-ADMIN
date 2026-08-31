import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { getBeritaById } from '../services/api';
import '../components/berita/berita.css';

export default function DetailBerita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBerita() {
      try {
        const data = await getBeritaById(id);
        setBerita(data);
      } catch (error) {
        console.error('Error loading berita:', error);
        alert('Gagal memuat data berita');
        navigate('/berita');
      } finally {
        setLoading(false);
      }
    }

    fetchBerita();
  }, [id, navigate]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (!berita) {
    return (
      <PageContainer>
        <div className="empty-state glass-panel">
          <h3>Berita Tidak Ditemukan</h3>
          <p>Berita yang Anda cari tidak ditemukan.</p>
          <Link to="/berita">
            <Button>Kembali ke Berita</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const tanggal = berita.tanggal ? new Date(berita.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Detail Berita</h1>
          <p className="dashboard-subtitle">Pratinjau berita</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/berita/edit/${berita.id}`}>
            <Button>Edit Berita</Button>
          </Link>
          <Link to="/berita">
            <Button variant="secondary">Kembali</Button>
          </Link>
        </div>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px' }}>
        {berita.gambar && (
          <img
            src={berita.gambar}
            alt={berita.judul}
            style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }}
          />
        )}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className={`status-badge ${berita.status === 'Publish' ? 'status-badge--publish' : 'status-badge--draft'}`}>
            {berita.status}
          </span>
          <span className="category-badge category-badge--default">{berita.kategori}</span>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
          {berita.judul}
        </h2>

        <p style={{ color: 'var(--text-gray)', marginBottom: '1.5rem' }}>
          Oleh {berita.penulis} &middot; {tanggal}
        </p>

        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-dark)' }}>
          {berita.konten}
        </p>
      </div>
    </PageContainer>
  );
}
