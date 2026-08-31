import './common.css';

export default function Badge({ status }) {
  const variant = status === 'Aktif' ? 'success' : 
                 status === 'Dalam Pendataan' ? 'warning' : 'default';
  
  return <span className={`badge badge-${variant}`}>{status}</span>;
}
