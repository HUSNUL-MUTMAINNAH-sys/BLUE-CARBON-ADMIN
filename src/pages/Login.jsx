import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import logoBantaeng from '../assets/logo-bantaeng.png';
import { useAuth } from '../context/AuthContext';
import { signIn } from '../services/auth';
import './login.css';

export default function Login() {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && session) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Email atau password salah.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card glass-panel" onSubmit={handleSubmit}>
        <div className="login-brand">
          <img src={logoBantaeng} alt="" />
          <div>
            <strong>Blue Carbon</strong>
            <small>Admin Panel — Kelurahan Lembang</small>
          </div>
        </div>

        <h1>Masuk ke Panel Admin</h1>
        <p className="login-subtitle">Gunakan akun admin yang sudah didaftarkan.</p>

        {error && <div className="login-error">{error}</div>}

        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="admin@contoh.id"
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary login-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
