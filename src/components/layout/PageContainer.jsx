import './layout.css';

export default function PageContainer({ children }) {
  return (
    <div className="page-container">
      <div className="container">
        {children}
      </div>
    </div>
  );
}
