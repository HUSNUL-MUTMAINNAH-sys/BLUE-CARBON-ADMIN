import Button from '../common/Button';
import './lahan.css';

export default function DeleteModal({ lahan, onConfirm, onCancel, isDeleting }) {
  if (!lahan) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>⚠️ Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus data lahan berikut?</p>
        
        <div className="delete-info">
          <div><strong>Pembudidaya:</strong> {lahan.pembudidaya}</div>
          <div><strong>Lokasi:</strong> {lahan.lokasi}</div>
          <div><strong>Luas:</strong> {lahan.luas} ha</div>
        </div>

        <p className="warning-text">
          ⚠️ Tindakan ini tidak dapat dibatalkan!
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
