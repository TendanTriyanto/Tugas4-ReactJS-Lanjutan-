import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage } from '../_services/messages';
import { getErrorMessage } from '../utils/format';

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const data = await sendMessage(form);
      setSuccess(data.message || 'Pesan berhasil dikirim. Admin akan segera membalas.');
      setForm((prev) => ({ ...prev, subject: '', message: '' }));
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengirim pesan.'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-10 text-white sm:px-10">
        <h1 className="text-3xl font-bold">Hubungi Admin</h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-100">
          Punya pertanyaan tentang stok, pengiriman, atau pembayaran? Kirim pesan dan admin
          kami akan menghubungi Anda kembali.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          {[
            { icon: '📍', title: 'Alamat', value: 'Jl. Merdeka No. 1, Jakarta Pusat' },
            { icon: '📞', title: 'Telepon', value: '0812-3456-7890' },
            { icon: '✉️', title: 'Email', value: 'admin@booksales.com' },
            { icon: '🕘', title: 'Jam operasional', value: 'Senin - Sabtu, 08.00 - 17.00 WIB' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xl">{item.icon}</span>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{item.title}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Kirim pesan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lengkapi formulir di bawah ini. Semua kolom wajib diisi.
            </p>

            {success && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Subjek</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="Contoh: Tanya ketersediaan stok" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Pesan</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows="6" placeholder="Tuliskan pertanyaan Anda..." className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
