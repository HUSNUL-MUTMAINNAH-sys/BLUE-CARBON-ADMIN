import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import BeritaForm from '../components/berita/BeritaForm';
import { createBerita } from '../services/api';

export default function TambahBerita() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setIsLoading(true);
      await createBerita(data);
      alert('Berita berhasil ditambahkan!');
      navigate('/berita');
    } catch (error) {
      console.error('Error creating berita:', error);
      alert('Gagal menambahkan berita: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Tambah Berita</h1>
          <p className="dashboard-subtitle">Tambahkan berita atau informasi terbaru</p>
        </div>
      </div>

      <BeritaForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/berita')}
        isLoading={isLoading}
        backTo="/berita"
      />
    </PageContainer>
  );
}
