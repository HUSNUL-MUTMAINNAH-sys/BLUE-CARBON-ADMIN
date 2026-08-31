import { Link } from 'react-router-dom';
import Button from '../common/Button';
import './berita.css';
import '../lahan/lahan.css';

function formatTanggal(tanggal) {
  if (!tanggal) return '-';
  const date = new Date(tanggal);
  if (Number.isNaN(date.getTime())) return tanggal;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function BeritaTable({ data, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <h3>Belum Ada Berita</h3>
        <p>Mulai dengan menambahkan berita pertama Anda.</p>
        <Link to="/berita/tambah">
          <Button>+ Tambah Berita</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="table-container glass-panel">
      <div className="table-wrapper">
        <table className="lahan-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Penulis</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((berita) => (
              <tr key={berita.id}>
                <td>
                  {berita.gambar ? (
                    <img src={berita.gambar} alt={berita.judul} className="berita-thumb-cell" />
                  ) : (
                    <span className="berita-thumb-fallback">Tidak ada</span>
                  )}
                </td>
                <td><strong>{berita.judul}</strong></td>
                <td>{formatTanggal(berita.tanggal)}</td>
                <td>{berita.penulis}</td>
                <td>
                  <span className={`status-badge ${berita.status === 'Publish' ? 'status-badge--publish' : 'status-badge--draft'}`}>
                    {berita.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/berita/${berita.id}`} className="btn-action btn-view" title="Lihat Berita">
                      Lihat
                    </Link>
                    <Link to={`/berita/edit/${berita.id}`} className="btn-action btn-edit" title="Edit Berita">
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(berita)}
                      className="btn-action btn-delete"
                      title="Hapus Berita"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
