import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import BeritaTable from '../components/berita/BeritaTable';
import DeleteBeritaModal from '../components/berita/DeleteBeritaModal';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/common/Button';
import { getAllBerita, deleteBerita } from '../services/api';

export default function Berita() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const berita = await getAllBerita();
      setData(berita);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data berita');
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
      await deleteBerita(deleteTarget.id);
      await loadData();
      setDeleteTarget(null);
      alert('Berita berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus berita');
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
          <h1 className="dashboard-title">Berita</h1>
          <p className="dashboard-subtitle">Kelola berita dan informasi Blue Carbon</p>
        </div>
        <Link to="/berita/tambah">
          <Button>+ Tambah Berita</Button>
        </Link>
      </div>

      <BeritaTable
        data={data}
        onDelete={(berita) => setDeleteTarget(berita)}
      />

      {deleteTarget && (
        <DeleteBeritaModal
          berita={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </PageContainer>
  );
}
