import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './pelaku.css';
import '../lahan/lahan.css';

export default function PelakuTable({ data, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <h3>Belum Ada Data Pelaku</h3>
        <p>Mulai tambahkan data nelayan atau pembudidaya rumput laut pertama Anda.</p>
        <Link to="/data-pelaku/tambah">
          <Button>Tambah Data Pelaku</Button>
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
              <th>Nama</th>
              <th>Jenis Pelaku</th>
              <th>Lokasi</th>
              <th>Luas Lahan (ha)</th>
              <th>Produksi/Tahun (kg)</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pelaku) => (
              <tr key={pelaku.id}>
                <td>
                  <div className="pelaku-name-cell">
                    {pelaku.foto ? (
                      <img src={pelaku.foto} alt={pelaku.nama} className="pelaku-avatar" />
                    ) : (
                      <span className="pelaku-avatar-fallback">
                        {pelaku.nama ? pelaku.nama.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                    <strong>{pelaku.nama}</strong>
                  </div>
                </td>
                <td><span className="pelaku-jenis-badge">{pelaku.jenisPelaku}</span></td>
                <td>{pelaku.lokasi}</td>
                <td>{Number(pelaku.luasLahan || 0).toFixed(2)}</td>
                <td>{Number(pelaku.estimasiProduksiTahun || 0).toLocaleString('id-ID')}</td>
                <td><Badge status={pelaku.status} /></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/data-pelaku/${pelaku.id}`} className="btn-action btn-view" title="Lihat Detail">
                      Lihat
                    </Link>
                    <Link to={`/data-pelaku/edit/${pelaku.id}`} className="btn-action btn-edit" title="Edit Data">
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(pelaku)}
                      className="btn-action btn-delete"
                      title="Hapus Data"
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
