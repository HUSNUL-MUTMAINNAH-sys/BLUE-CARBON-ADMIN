import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { getMonitoringById, getLahanById } from '../services/api';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DetailMonitoring() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monitoring, setMonitoring] = useState(null);
  const [lahan, setLahan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const monitoringData = await getMonitoringById(id);
        setMonitoring(monitoringData);

        if (monitoringData?.land_id) {
          const lahanData = await getLahanById(monitoringData.land_id);
          setLahan(lahanData);
        }
      } catch (error) {
        console.error('Error loading data monitoring:', error);
        alert('Gagal memuat data monitoring');
        navigate('/monitoring');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (!monitoring) {
    return (
      <PageContainer>
        <div className="empty-state glass-panel">
          <h3>Data Tidak Ditemukan</h3>
          <p>Data monitoring yang Anda cari tidak ditemukan.</p>
          <Link to="/monitoring">
            <Button>Kembali ke Data Monitoring</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Detail Monitoring</h1>
          <p className="dashboard-subtitle">Informasi lengkap data monitoring</p>
        </div>
        <Link to="/monitoring">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>

      <div className="glass-panel" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="detail-field">
            <label className="detail-label">Lahan</label>
            <div className="detail-value">{lahan?.lokasi || '-'}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Pemilik Lahan</label>
            <div className="detail-value">{lahan?.pembudidaya || '-'}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Tanggal Monitoring</label>
            <div className="detail-value">{formatTanggal(monitoring.monitoring_date)}</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Produksi</label>
            <div className="detail-value">{monitoring.production} kg</div>
          </div>

          <div className="detail-field">
            <label className="detail-label">Penghasilan Panen</label>
            <div className="detail-value">
              {monitoring.revenue !== undefined && monitoring.revenue !== null
                ? `Rp${Number(monitoring.revenue).toLocaleString('id-ID')}`
                : '-'}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
