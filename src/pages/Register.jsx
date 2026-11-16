import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';

const initialForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: '',
};

export default function Register() {
  const { user, register, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Registrasi gagal. Periksa kembali data Anda.'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="text-center">
          <span className="text-3xl">📚</span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Buat akun BookStore</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar untuk mulai berbelanja dan melacak pesanan buku Anda.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nama lengkap</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Nama lengkap" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
            <input name="username" value={form.username} onChange={handleChange} required placeholder="username" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="nama@email.com" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">No. HP</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Alamat</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows="2" placeholder="Alamat lengkap pengiriman" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} placeholder="Minimal 8 karakter" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Konfirmasi password</label>
            <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required minLength={8} placeholder="Ulangi password" className={inputClass} />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
