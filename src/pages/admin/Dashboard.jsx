import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getAllOrders } from '../../_services/orders';
import { formatDateTime, formatRupiah, ORDER_STATUS, statusBadge } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getStats(), getAllOrders()])
      .then(([statData, orderData]) => {
        if (!active) return;
        setStats(statData);
        setOrders((orderData || []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const cards = stats
    ? [
        { label: 'Total Buku', value: stats.books, icon: '📚', to: '/admin/books', color: 'bg-indigo-50 text-indigo-700' },
        { label: 'Pesanan', value: stats.orders, icon: '🧾', to: '/admin/orders', color: 'bg-amber-50 text-amber-700' },
        { label: 'User Terdaftar', value: stats.users, icon: '👥', to: '/admin/users', color: 'bg-emerald-50 text-emerald-700' },
        { label: 'Pesan Belum Dibaca', value: stats.unread_messages, icon: '✉️', to: '/admin/messages', color: 'bg-rose-50 text-rose-700' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 to-slate-900 px-6 py-8 text-white">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-indigo-100">
          Pantau data buku, pesanan, user, dan pesan masuk dari satu tempat.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/admin/books" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 hover:bg-white/20">
            + Tambah Buku
          </Link>
          <Link to="/admin/orders" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 hover:bg-white/20">
            Lihat Pesanan
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
            ))
          : cards.map((card) => (
              <Link key={card.label} to={card.to} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${card.color}`}>{card.icon}</span>
                  <span className="text-2xl font-extrabold text-slate-800">{card.value}</span>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">{card.label}</p>
              </Link>
            ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pendapatan (selesai)</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">{formatRupiah(stats?.revenue || 0)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pesanan menunggu</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-600">{stats?.pending_orders ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Kategori / Author</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-800">{stats?.genres ?? 0} / {stats?.authors ?? 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-800">Pesanan terbaru</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-indigo-600 hover:underline">Lihat semua →</Link>
        </div>
        {orders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">Belum ada pesanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const status = statusBadge(ORDER_STATUS, order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{order.invoice_number}</td>
                      <td className="px-5 py-3 text-slate-600">{order.user?.name || '-'}</td>
                      <td className="px-5 py-3 text-slate-500">{formatDateTime(order.created_at)}</td>
                      <td className="px-5 py-3 font-semibold text-slate-700">{formatRupiah(order.total_price)}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
