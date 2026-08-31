import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import LahanTable from '../components/lahan/LahanTable';
import DeleteModal from '../components/lahan/DeleteModal';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { getAllLahan, deleteLahan } from '../services/api';

export default function DataLahan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const lahan = await getAllLahan();
      setData(lahan);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data lahan');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteLahan(deleteTarget.id);
      await loadData();
      setDeleteTarget(null);
      alert('Data berhasil dihapus!');
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
          <h1 className="dashboard-title">Data Lahan</h1>
          <p className="dashboard-subtitle">Kelola data lahan budidaya rumput laut</p>
        </div>
        <Link to="/data-lahan/tambah">
          <Button>Tambah Lahan</Button>
        </Link>
      </div>

      <LahanTable 
        data={data} 
        onDelete={(lahan) => setDeleteTarget(lahan)} 
      />

      {deleteTarget && (
        <DeleteModal
          lahan={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </PageContainer>
  );
}
