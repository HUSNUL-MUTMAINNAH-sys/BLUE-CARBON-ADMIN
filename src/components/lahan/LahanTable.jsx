import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './lahan.css';

export default function LahanTable({ data, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <h3>Belum Ada Data Lahan</h3>
        <p>Mulai tambahkan data lahan budidaya pertama Anda.</p>
        <Link to="/data-lahan/tambah">
          <Button>Tambah Lahan</Button>
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
              <th>Pembudidaya</th>
              <th>Lokasi</th>
              <th>Jenis Budidaya</th>
              <th>Luas (m)</th>
              <th>Siklus (tahun)</th>
              <th>Status</th>
              <th>Koordinat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((lahan) => (
              <tr key={lahan.id}>
                <td><strong>{lahan.pembudidaya}</strong></td>
                <td>{lahan.lokasi}</td>
                <td>{lahan.jenisPelaku || '-'}</td>
                <td>{(lahan.luas * 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                <td>{lahan.siklusPanen ?? lahan.siklus ?? '-'}</td>
                <td><Badge status={lahan.status} /></td>
                <td className="coord-cell">
                  {lahan.latitude}, {lahan.longitude}
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/data-lahan/${lahan.id}`} className="btn-action btn-view" title="Lihat Detail">
                      Lihat
                    </Link>
                    <Link to={`/data-lahan/edit/${lahan.id}`} className="btn-action btn-edit" title="Edit Data">
                      Edit
                    </Link>
                    <button 
                      onClick={() => onDelete(lahan)} 
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
