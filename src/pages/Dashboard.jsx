import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/dashboard/StatCard';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { getAllLahan } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLahan: 0,
    totalPembudidaya: 0,
    totalLuas: 0,
    lahanAktif: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAllLahan();
        
        const pembudidayaUnique = new Set(data.map(l => l.pembudidaya)).size;
        const totalLuas = data.reduce((sum, l) => sum + l.luas, 0);
        const lahanAktif = data.filter(l => l.status === 'Aktif').length;

        setStats({
          totalLahan: data.length,
          totalPembudidaya: pembudidayaUnique,
          totalLuas: totalLuas.toFixed(2),
          lahanAktif
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Admin</h1>
        <p className="dashboard-subtitle">Ringkasan data budidaya rumput laut</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Lahan"
          value={stats.totalLahan}
        />
        <StatCard 
          title="Total Pembudidaya"
          value={stats.totalPembudidaya}
        />
        <StatCard 
          title="Total Luas Lahan"
          value={`${stats.totalLuas} ha`}
        />
        <StatCard 
          title="Lahan Aktif"
          value={stats.lahanAktif}
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/data-lahan">
          <Button>Kelola Data Lahan</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
