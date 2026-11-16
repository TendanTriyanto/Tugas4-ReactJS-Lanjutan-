import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCover from '../components/BookCover';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { checkout } from '../_services/orders';
import { formatRupiah, getErrorMessage } from '../utils/format';

const payments = [
  {
    value: 'cod',
    title: 'Payment at Delivery (COD)',
    description: 'Bayar sebelum buku dikirim. Admin akan mengonfirmasi pembayaran Anda.',
    icon: '💵',
  },
  {
    value: 'midtrans',
    title: 'Midtrans (Online)',
    description: 'Pembayaran online via Midtrans. Memerlukan konfigurasi Midtrans di server.',
    icon: '💳',
  },
];

export default function Checkout() {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shipping_address: user?.address || '',
    phone: user?.phone || '',
    notes: '',
    payment_method: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await checkout(form);
      await refresh();
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Checkout gagal. Silakan coba lagi.'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <span className="grid mx-auto h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Pesanan berhasil dibuat!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Admin akan segera memproses pesanan Anda.
          </p>

          <div className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor invoice</span>
              <span className="font-semibold text-slate-800">{result.data.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-slate-800">{formatRupiah(result.data.total_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Metode pembayaran</span>
              <span className="font-semibold text-slate-800">
                {result.payment?.method === 'midtrans' ? 'Midtrans' : 'Payment at Delivery (COD)'}
              </span>
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {result.payment?.instructions}
          </p>

          {result.payment?.redirect_url && (
            <a
              href={result.payment.redirect_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Lanjutkan Pembayaran Midtrans
            </a>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/orders" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Lihat Pesanan Saya
            </Link>
            <Link to="/books" className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Belanja lagi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Tidak ada yang bisa di-checkout</h1>
        <p className="mt-2 text-sm text-slate-500">Keranjang Anda masih kosong.</p>
        <Link to="/books" className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white">
          Pilih Buku
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">Lengkapi data pengiriman dan pilih metode pembayaran.</p>
        </div>
        <Link to="/cart" className="text-sm font-semibold text-indigo-600 hover:underline">
          ← Kembali ke keranjang
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Data pengiriman</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama penerima</label>
                <input value={user?.name || ''} readOnly className={`${inputClass} bg-slate-50 text-slate-500`} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">No. HP</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="08xxxxxxxxxx" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input value={user?.email || ''} readOnly className={`${inputClass} bg-slate-50 text-slate-500`} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Alamat lengkap</label>
                <textarea name="shipping_address" value={form.shipping_address} onChange={handleChange} required rows="3" placeholder="Jalan, nomor rumah, kota, kode pos" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Catatan (opsional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" placeholder="Contoh: tolong packing rapi" className={inputClass} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Metode pembayaran</h2>
            <div className="mt-4 space-y-3">
              {payments.map((payment) => (
                <label
                  key={payment.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    form.payment_method === payment.value
                      ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={payment.value}
                    checked={form.payment_method === payment.value}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span className="text-xl">{payment.icon}</span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{payment.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{payment.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Pesanan Anda</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <BookCover src={item.book?.cover_url} title={item.book?.title} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-slate-800">{item.book?.title}</p>
                    <p className="text-xs text-slate-500">{item.qty} × {formatRupiah(item.book?.price)}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatRupiah((item.book?.price || 0) * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatRupiah(cart.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkir</span>
                <span className="text-emerald-600">Gratis</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="text-indigo-700">{formatRupiah(cart.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? 'Memproses pesanan...' : 'Buat Pesanan'}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Dengan membuat pesanan, Anda menyetujui syarat dan ketentuan BookStore.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
