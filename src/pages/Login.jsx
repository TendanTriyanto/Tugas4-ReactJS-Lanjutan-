import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';

export default function Login() {
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      const destination =
        data.user.role === 'admin' ? '/admin' : location.state?.from || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Email atau password salah.'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setForm({ email: 'admin@booksales.com', password: 'admin123' });
    } else {
      setForm({ email: 'budi@example.com', password: 'customer123' });
    }
    setError('');
  };

  return (
    <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div className="hidden overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
            📚 BookStore
          </span>
          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Temukan buku favoritmu, <br /> baca lebih banyak.
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-indigo-100">
            Masuk untuk melanjutkan belanja, memantau pesanan, dan mengelola koleksi buku
            jika kamu admin.
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 p-5 text-sm text-indigo-100">
          <p className="font-semibold text-white">Akun demo</p>
          <p className="mt-2">Admin: admin@booksales.com / admin123</p>
          <p>Customer: budi@example.com / customer123</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Masuk ke akun</h2>
          <p className="mt-1 text-sm text-slate-500">Gunakan email dan password yang terdaftar.</p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-16 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-600"
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Isi akun admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('customer')}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Isi akun customer
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
