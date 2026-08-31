import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import PelakuForm from '../components/pelaku/PelakuForm';
import { createPelaku } from '../services/api';

export default function TambahDataPelaku() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setIsLoading(true);
      await createPelaku(data);
      alert('Data pelaku berhasil ditambahkan!');
      navigate('/data-pelaku');
    } catch (error) {
      console.error('Error creating pelaku:', error);
      alert('Gagal menambahkan data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Tambah Data Pelaku Rumput Laut</h1>
          <p className="dashboard-subtitle">Masukkan data nelayan atau pembudidaya rumput laut</p>
        </div>
      </div>

      <PelakuForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/data-pelaku')}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
