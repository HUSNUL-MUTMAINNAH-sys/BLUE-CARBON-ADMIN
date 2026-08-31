import './common.css';

export default function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Memuat data...</p>
    </div>
  );
}
