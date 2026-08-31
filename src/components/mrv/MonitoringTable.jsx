import { Link } from 'react-router-dom';
import '../lahan/lahan.css';
import './mrv.css';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatRupiah(value) {
  if (value === undefined || value === null || value === '') return '-';
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

export default function MonitoringTable({ data, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <h3>Belum Ada Data Monitoring</h3>
        <p>Data monitoring akan tampil di sini setelah pemilik lahan menginput data.</p>
      </div>
    );
  }

  return (
    <div className="table-container glass-panel">
      <div className="table-wrapper">
        <table className="lahan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal Monitoring</th>
              <th>Lahan</th>
              <th>Pemilik Lahan</th>
              <th>Produksi (kg)</th>
              <th>Penghasilan Panen (Rp)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{formatTanggal(item.monitoring_date)}</td>
                <td><strong>{item.lokasi || '-'}</strong></td>
                <td>{item.pembudidaya || '-'}</td>
                <td>{Number(item.production).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>{formatRupiah(item.revenue)}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/monitoring/${item.id}`} className="btn-action btn-view" title="Lihat Detail">
                      Lihat
                    </Link>
                    <button
                      onClick={() => onDelete(item)}
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
