import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import LahanForm from '../components/lahan/LahanForm';
import LoadingState from '../components/common/LoadingState';
import { getLahanById, updateLahan } from '../services/api';

export default function EditLahan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lahan, setLahan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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

  async function handleSubmit(data) {
    try {
      setIsUpdating(true);
      await updateLahan(id, data);
      alert('Data lahan berhasil diperbarui!');
      navigate('/data-lahan');
    } catch (error) {
      console.error('Error updating lahan:', error);
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
        <h1 className="dashboard-title">Edit Lahan</h1>
        <p className="dashboard-subtitle">Perbarui informasi lahan budidaya</p>
      </div>

      <LahanForm
        initialData={lahan}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/data-lahan')}
        isLoading={isUpdating}
      />
    </PageContainer>
  );
}
