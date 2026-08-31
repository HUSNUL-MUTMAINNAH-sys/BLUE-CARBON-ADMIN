import './dashboard.css';

export default function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card glass-panel">
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );
}
