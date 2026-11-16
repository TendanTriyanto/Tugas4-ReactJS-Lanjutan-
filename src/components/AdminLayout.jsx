import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menu = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/books', label: 'Data Buku', icon: '📚' },
  { to: '/admin/genres', label: 'Kategori Buku', icon: '🏷️' },
  { to: '/admin/authors', label: 'Author', icon: '✍️' },
  { to: '/admin/orders', label: 'Pesanan', icon: '🧾' },
  { to: '/admin/users', label: 'User Terdaftar', icon: '👥' },
  { to: '/admin/messages', label: 'Pesan Masuk', icon: '✉️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-200">
      <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg text-white">📚</span>
        <div>
          <p className="text-sm font-bold text-white">BookStore</p>
          <p className="text-xs text-slate-400">Panel Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <Link
          to="/"
          className="mb-2 block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          🏠 Lihat Toko
        </Link>
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 p-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{user?.name}</p>
            <p className="truncate text-[11px] text-slate-400">Administrator</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-rose-500/90 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-500"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
            aria-label="Buka menu admin"
          >
            ☰
          </button>
          <p className="text-sm font-semibold text-slate-700">Manajemen BookStore</p>
          <span className="ml-auto hidden text-xs text-slate-400 sm:block">
            Login sebagai <b className="text-slate-600">{user?.username}</b>
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
