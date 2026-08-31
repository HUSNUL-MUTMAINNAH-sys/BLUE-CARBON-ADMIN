import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import MonitoringTable from '../components/mrv/MonitoringTable';
import DeleteMonitoringModal from '../components/mrv/DeleteMonitoringModal';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { getAllMonitoring, deleteMonitoring, getAllLahan } from '../services/api';
import '../components/mrv/mrv.css';

export default function DataMonitoring() {
  const [monitoringData, setMonitoringData] = useState([]);
  const [lahanList, setLahanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter state
  const [filterLahan, setFilterLahan] = useState('');
  const [filterDari, setFilterDari] = useState('');
  const [filterSampai, setFilterSampai] = useState('');
  const [appliedFilter, setAppliedFilter] = useState({ lahan: '', dari: '', sampai: '' });

  async function loadData() {
    try {
      setLoading(true);
      const [monitoring, lahan] = await Promise.all([getAllMonitoring(), getAllLahan()]);
      setMonitoringData(monitoring);
      setLahanList(lahan);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data monitoring');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Gabungkan data monitoring dengan informasi lahan (lokasi & pemilik) berdasarkan land_id
  const joinedData = useMemo(() => {
    return monitoringData.map((item) => {
      const lahan = lahanList.find((l) => l.id === item.land_id);
      return {
        ...item,
        lokasi: lahan?.lokasi || '-',
        pembudidaya: lahan?.pembudidaya || '-',
      };
    });
  }, [monitoringData, lahanList]);

  // Daftar lokasi lahan yang unik untuk filter (beberapa lahan bisa berbagi nama lokasi yang sama)
  const lokasiOptions = useMemo(() => {
    const seen = new Set();
    const lokasiList = [];
    lahanList.forEach((l) => {
      if (l.lokasi && !seen.has(l.lokasi)) {
        seen.add(l.lokasi);
        lokasiList.push(l.lokasi);
      }
    });
    return lokasiList;
  }, [lahanList]);

  const filteredData = useMemo(() => {
    return joinedData.filter((item) => {
      if (appliedFilter.lahan && item.lokasi !== appliedFilter.lahan) {
        return false;
      }
      if (appliedFilter.dari && item.monitoring_date < appliedFilter.dari) {
        return false;
      }
      if (appliedFilter.sampai && item.monitoring_date > appliedFilter.sampai) {
        return false;
      }
      return true;
    });
  }, [joinedData, appliedFilter]);

  function handleFilter() {
    setAppliedFilter({ lahan: filterLahan, dari: filterDari, sampai: filterSampai });
  }

  function handleReset() {
    setFilterLahan('');
    setFilterDari('');
    setFilterSampai('');
    setAppliedFilter({ lahan: '', dari: '', sampai: '' });
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteMonitoring(deleteTarget.id);
      await loadData();
      setDeleteTarget(null);
      alert('Data monitoring berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus data');
    } finally {
      setIsDeleting(false);
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
          <h1 className="dashboard-title">Data Monitoring</h1>
          <p className="dashboard-subtitle">Daftar data monitoring yang diinput oleh pemilik lahan.</p>
        </div>
        <Link to="/monitoring/tambah">
          <Button>+ Tambah MRV</Button>
        </Link>
      </div>

      <div className="mrv-filter-bar glass-panel">
        <div className="mrv-filter-field">
          <label htmlFor="filterLahan">Pilih Lahan</label>
          <select id="filterLahan" value={filterLahan} onChange={(e) => setFilterLahan(e.target.value)}>
            <option value="">Semua Lahan</option>
            {lokasiOptions.map((lokasi) => (
              <option key={lokasi} value={lokasi}>{lokasi}</option>
            ))}
          </select>
        </div>

        <div className="mrv-filter-field">
          <label htmlFor="filterDari">Dari Tanggal</label>
          <input
            type="date"
            id="filterDari"
            value={filterDari}
            onChange={(e) => setFilterDari(e.target.value)}
          />
        </div>

        <div className="mrv-filter-field">
          <label htmlFor="filterSampai">Sampai Tanggal</label>
          <input
            type="date"
            id="filterSampai"
            value={filterSampai}
            onChange={(e) => setFilterSampai(e.target.value)}
          />
        </div>

        <div className="mrv-filter-actions">
          <Button onClick={handleFilter}>Filter</Button>
          <Button variant="secondary" onClick={handleReset}>Reset</Button>
        </div>
      </div>

      <MonitoringTable
        data={filteredData}
        onDelete={(item) => setDeleteTarget(item)}
      />

      {deleteTarget && (
        <DeleteMonitoringModal
          monitoring={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </PageContainer>
  );
}
