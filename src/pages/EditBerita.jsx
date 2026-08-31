import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import BeritaForm from '../components/berita/BeritaForm';
import LoadingState from '../components/common/LoadingState';
import { getBeritaById, updateBerita } from '../services/api';

export default function EditBerita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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

  async function handleSubmit(data) {
    try {
      setIsUpdating(true);
      await updateBerita(id, data);
      alert('Berita berhasil diperbarui!');
      navigate('/berita');
    } catch (error) {
      console.error('Error updating berita:', error);
      alert('Gagal mengupdate berita: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Edit Berita</h1>
          <p className="dashboard-subtitle">Perbarui berita atau informasi</p>
        </div>
      </div>

      <BeritaForm
        initialData={berita}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/berita')}
        isLoading={isUpdating}
        backTo="/berita"
      />
    </PageContainer>
  );
}
