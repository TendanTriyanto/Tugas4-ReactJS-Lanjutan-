import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover';
import { getMyOrders, payOrder } from '../_services/orders';
import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  ORDER_STATUS,
  formatDateTime,
  formatRupiah,
  getErrorMessage,
  statusBadge,
} from '../utils/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    getMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError('Gagal memuat pesanan.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handlePay = async (order) => {
    setPayingId(order.id);
    setError('');
    try {
      const data = await payOrder(order.id);
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }
      loadOrders();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memproses pembayaran.'));
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Pesanan Saya</h1>
      <p className="mt-1 text-sm text-slate-500">Riwayat dan status pesanan buku Anda.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-5xl">🧾</p>
          <h2 className="mt-3 text-lg font-bold text-slate-800">Belum ada pesanan</h2>
          <p className="mt-1 text-sm text-slate-500">Yuk mulai belanja buku pertamamu.</p>
          <Link to="/books" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Jelajahi Buku
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {orders.map((order) => {
            const status = statusBadge(ORDER_STATUS, order.status);
            const payment = statusBadge(PAYMENT_STATUS, order.payment_status);
            return (
              <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{order.invoice_number}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.className}`}>{payment.label}</span>
                  </div>
                </header>

                <div className="divide-y divide-slate-100 px-5">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <BookCover src={item.book?.cover_url} title={item.title} className="h-full w-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.qty} × {formatRupiah(item.price)}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{formatRupiah(item.subtotal)}</p>
                    </div>
                  ))}
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                  <div className="text-xs text-slate-500">
                    <p>Metode: <b className="text-slate-700">{PAYMENT_METHOD[order.payment_method] || order.payment_method}</b></p>
                    <p className="mt-1 max-w-md">Alamat: {order.shipping_address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.payment_method === 'midtrans' && order.payment_status === 'unpaid' && (
                      <button
                        type="button"
                        onClick={() => handlePay(order)}
                        disabled={payingId === order.id}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300"
                      >
                        {payingId === order.id ? 'Memproses...' : 'Bayar Sekarang'}
                      </button>
                    )}
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-lg font-bold text-indigo-700">{formatRupiah(order.total_price)}</p>
                    </div>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
