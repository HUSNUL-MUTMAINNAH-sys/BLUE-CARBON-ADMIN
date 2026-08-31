import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataLahan from './pages/DataLahan';
import TambahLahan from './pages/TambahLahan';
import EditLahan from './pages/EditLahan';
import DetailLahan from './pages/DetailLahan';
import DataPelaku from './pages/DataPelaku';
import TambahDataPelaku from './pages/TambahDataPelaku';
import EditDataPelaku from './pages/EditDataPelaku';
import DetailDataPelaku from './pages/DetailDataPelaku';
import Berita from './pages/Berita';
import TambahBerita from './pages/TambahBerita';
import EditBerita from './pages/EditBerita';
import DetailBerita from './pages/DetailBerita';
import DataMonitoring from './pages/DataMonitoring';
import TambahMRV from './pages/TambahMRV';
import DetailMonitoring from './pages/DetailMonitoring';

function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <Sidebar />
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />

          <Route path="/data-lahan" element={<AdminLayout><DataLahan /></AdminLayout>} />
          <Route path="/data-lahan/tambah" element={<AdminLayout><TambahLahan /></AdminLayout>} />
          <Route path="/data-lahan/edit/:id" element={<AdminLayout><EditLahan /></AdminLayout>} />
          <Route path="/data-lahan/:id" element={<AdminLayout><DetailLahan /></AdminLayout>} />

          <Route path="/data-pelaku" element={<AdminLayout><DataPelaku /></AdminLayout>} />
          <Route path="/data-pelaku/tambah" element={<AdminLayout><TambahDataPelaku /></AdminLayout>} />
          <Route path="/data-pelaku/edit/:id" element={<AdminLayout><EditDataPelaku /></AdminLayout>} />
          <Route path="/data-pelaku/:id" element={<AdminLayout><DetailDataPelaku /></AdminLayout>} />

          <Route path="/berita" element={<AdminLayout><Berita /></AdminLayout>} />
          <Route path="/berita/tambah" element={<AdminLayout><TambahBerita /></AdminLayout>} />
          <Route path="/berita/edit/:id" element={<AdminLayout><EditBerita /></AdminLayout>} />
          <Route path="/berita/:id" element={<AdminLayout><DetailBerita /></AdminLayout>} />

          <Route path="/monitoring" element={<AdminLayout><DataMonitoring /></AdminLayout>} />
          <Route path="/monitoring/tambah" element={<AdminLayout><TambahMRV /></AdminLayout>} />
          <Route path="/monitoring/:id" element={<AdminLayout><DetailMonitoring /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
