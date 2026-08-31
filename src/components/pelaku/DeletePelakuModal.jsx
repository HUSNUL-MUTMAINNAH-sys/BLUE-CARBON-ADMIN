import Button from '../common/Button';
import '../lahan/lahan.css';

export default function DeletePelakuModal({ pelaku, onConfirm, onCancel, isDeleting }) {
  if (!pelaku) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>⚠️ Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus data pelaku berikut?</p>

        <div className="delete-info">
          <div><strong>Nama:</strong> {pelaku.nama}</div>
          <div><strong>Jenis Pelaku:</strong> {pelaku.jenisPelaku}</div>
          <div><strong>Lokasi:</strong> {pelaku.lokasi}</div>
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
