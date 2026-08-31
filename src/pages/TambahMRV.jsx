import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import MonitoringForm from '../components/mrv/MonitoringForm';
import { createMonitoring } from '../services/api';

export default function TambahMRV() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setIsLoading(true);
      await createMonitoring(data);
      alert('Data MRV berhasil ditambahkan!');
      navigate('/monitoring');
    } catch (error) {
      console.error('Error creating monitoring:', error);
      alert('Gagal menambahkan data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Tambah MRV</h1>
          <p className="dashboard-subtitle">Masukkan data monitoring untuk lahan budidaya</p>
        </div>
      </div>

      <MonitoringForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/monitoring')}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
