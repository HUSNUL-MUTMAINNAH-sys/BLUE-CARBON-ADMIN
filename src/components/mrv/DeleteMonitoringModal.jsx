import Button from '../common/Button';
import '../lahan/lahan.css';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DeleteMonitoringModal({ monitoring, onConfirm, onCancel, isDeleting }) {
  if (!monitoring) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>⚠️ Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus data monitoring berikut?</p>

        <div className="delete-info">
          <div><strong>Lahan:</strong> {monitoring.lokasi || '-'}</div>
          <div><strong>Tanggal Monitoring:</strong> {formatTanggal(monitoring.monitoring_date)}</div>
          <div><strong>Produksi:</strong> {monitoring.production} kg</div>
        </div>

        <p className="warning-text">
          ⚠️ Tindakan ini tidak dapat dibatalkan! Data juga akan hilang dari grafik MRV publik.
        </p>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
}
