import Button from '../common/Button';
import '../lahan/lahan.css';

export default function DeleteBeritaModal({ berita, onConfirm, onCancel, isDeleting }) {
  if (!berita) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>⚠️ Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus berita berikut?</p>

        <div className="delete-info">
          <div><strong>Judul:</strong> {berita.judul}</div>
          <div><strong>Penulis:</strong> {berita.penulis}</div>
          <div><strong>Status:</strong> {berita.status}</div>
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
