import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import LahanForm from '../components/lahan/LahanForm';
import { createLahan } from '../services/api';

export default function TambahLahan() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setIsLoading(true);
      await createLahan(data);
      alert('Data lahan berhasil ditambahkan!');
      navigate('/data-lahan');
    } catch (error) {
      console.error('Error creating lahan:', error);
      alert('Gagal menambahkan data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="page-header">
        <h1 className="dashboard-title">Tambah Lahan Baru</h1>
        <p className="dashboard-subtitle">Masukkan informasi lahan budidaya</p>
      </div>

      <LahanForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/data-lahan')}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
