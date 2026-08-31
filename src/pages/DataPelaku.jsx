import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import PelakuTable from '../components/pelaku/PelakuTable';
import DeletePelakuModal from '../components/pelaku/DeletePelakuModal';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { getAllPelaku, deletePelaku } from '../services/api';

export default function DataPelaku() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const pelaku = await getAllPelaku();
      setData(pelaku);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data pelaku');
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
      await deletePelaku(deleteTarget.id);
      await loadData();
      setDeleteTarget(null);
      alert('Data pelaku berhasil dihapus!');
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
          <h1 className="dashboard-title">Data Pelaku</h1>
          <p className="dashboard-subtitle">Kelola data nelayan dan pembudidaya rumput laut</p>
        </div>
        <Link to="/data-pelaku/tambah">
          <Button>+ Tambah Data Pelaku</Button>
        </Link>
      </div>

      <PelakuTable
        data={data}
        onDelete={(pelaku) => setDeleteTarget(pelaku)}
      />

      {deleteTarget && (
        <DeletePelakuModal
          pelaku={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </PageContainer>
  );
}
