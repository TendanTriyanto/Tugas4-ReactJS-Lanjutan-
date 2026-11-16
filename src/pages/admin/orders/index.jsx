import React, { useEffect, useState } from 'react';
import { getAllOrders, markOrderPaid, updateOrderStatus } from '../../../_services/orders';
import {
  formatDateTime,
  formatRupiah,
  getErrorMessage,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  statusBadge,
} from '../../../utils/format';

const statusOptions = Object.keys(ORDER_STATUS);

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllOrders({
        status: status || undefined,
        q: keyword || undefined,
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat pesanan.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, keyword]);

  const handleStatusChange = async (order, nextStatus) => {
    setBusyId(order.id);
    setNotice('');
    setError('');
    try {
      const data = await updateOrderStatus(order.id, nextStatus);
      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, ...data.data } : item)));
      setNotice(`Status ${order.invoice_number} diubah menjadi ${ORDER_STATUS[nextStatus]?.label || nextStatus}.`);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status pesanan.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkPaid = async (order) => {
    setBusyId(order.id);
    setNotice('');
    setError('');
    try {
      await markOrderPaid(order.id);
      setOrders((prev) =>
        prev.map((item) => (item.id === order.id ? { ...item, payment_status: 'paid' } : item))
      );
      setNotice(`Pembayaran ${order.invoice_number} ditandai lunas.`);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menandai pembayaran.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setKeyword(search.trim());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pesanan Buku</h1>
        <p className="mt-1 text-sm text-slate-500">Pantau dan proses pesanan dari seluruh user.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total pesanan', value: orders.length, color: 'text-slate-800' },
          { label: 'Belum dibayar', value: orders.filter((order) => order.payment_status === 'unpaid').length, color: 'text-amber-600' },
          { label: 'Selesai', value: orders.filter((order) => order.status === 'completed').length, color: 'text-emerald-600' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-800">Daftar Pesanan</h2>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                <option value="">Semua status</option>
                {statusOptions.map((value) => (
                  <option key={value} value={value}>{ORDER_STATUS[value].label}</option>
                ))}
              </select>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Cari</label>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Invoice / nama / email"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Cari
              </button>
            </form>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">Belum ada pesanan.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => {
              const statusInfo = statusBadge(ORDER_STATUS, order.status);
              const paymentInfo = statusBadge(PAYMENT_STATUS, order.payment_status);
              const expanded = expandedId === order.id;

              return (
                <div key={order.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : order.id)}
                        className="flex items-center gap-2 text-left"
                      >
                        <span className="text-slate-400">{expanded ? '▾' : '▸'}</span>
                        <span>
                          <span className="block text-sm font-bold text-slate-800">{order.invoice_number}</span>
                          <span className="block text-xs text-slate-500">
                            {order.user?.name || '-'} · {order.user?.email || '-'} · {formatDateTime(order.created_at)}
                          </span>
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}>{statusInfo.label}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentInfo.className}`}>{paymentInfo.label}</span>
                      <span className="text-sm font-bold text-slate-800">{formatRupiah(order.total_price)}</span>
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : order.id)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        {expanded ? 'Tutup' : 'Detail'}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 grid gap-4 rounded-xl bg-slate-50 p-4 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Item pesanan</p>
                        <div className="mt-2 space-y-2">
                          {(order.items || []).map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm">
                              <div>
                                <p className="font-medium text-slate-800">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.qty} × {formatRupiah(item.price)}</p>
                              </div>
                              <p className="font-semibold text-slate-700">{formatRupiah(item.subtotal)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pengiriman</p>
                          <p className="mt-1 text-sm text-slate-600">{order.shipping_address}</p>
                          <p className="text-sm text-slate-600">HP: {order.phone}</p>
                          {order.notes && <p className="mt-1 text-xs text-slate-500">Catatan: {order.notes}</p>}
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pembayaran</p>
                          <p className="mt-1 text-sm text-slate-600">{PAYMENT_METHOD[order.payment_method] || order.payment_method}</p>
                          {order.payment_status !== 'paid' && (
                            <button
                              type="button"
                              onClick={() => handleMarkPaid(order)}
                              disabled={busyId === order.id}
                              className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-300"
                            >
                              Tandai Lunas
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ubah status</label>
                          <select
                            value={order.status}
                            disabled={busyId === order.id}
                            onChange={(event) => handleStatusChange(order, event.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:opacity-50"
                          >
                            {statusOptions.map((value) => (
                              <option key={value} value={value}>{ORDER_STATUS[value].label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
