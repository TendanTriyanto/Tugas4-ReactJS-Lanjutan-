import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl">📖</p>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak pernah ada.
      </p>
      <Link to="/" className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
