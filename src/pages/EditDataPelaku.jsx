import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import PelakuForm from '../components/pelaku/PelakuForm';
import LoadingState from '../components/common/LoadingState';
import { getPelakuById, updatePelaku } from '../services/api';

export default function EditDataPelaku() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pelaku, setPelaku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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

  async function handleSubmit(data) {
    try {
      setIsUpdating(true);
      await updatePelaku(id, data);
      alert('Data pelaku berhasil diperbarui!');
      navigate('/data-pelaku');
    } catch (error) {
      console.error('Error updating pelaku:', error);
      alert('Gagal mengupdate data: ' + error.message);
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
          <h1 className="dashboard-title">Edit Data Pelaku</h1>
          <p className="dashboard-subtitle">Perbarui data nelayan atau pembudidaya rumput laut</p>
        </div>
      </div>

      <PelakuForm
        initialData={pelaku}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/data-pelaku')}
        isLoading={isUpdating}
      />
    </PageContainer>
  );
}
