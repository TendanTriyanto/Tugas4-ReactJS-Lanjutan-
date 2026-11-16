import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCover from './BookCover';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/format';

export default function BookCard({ book }) {
  const { user, isAdmin } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setError('');
    if (!user) {
      navigate('/login', { state: { from: '/books' } });
      return;
    }
    setStatus('loading');
    try {
      await add(book.id, 1);
      setStatus('success');
      window.setTimeout(() => setStatus('idle'), 1800);
    } catch (err) {
      setStatus('idle');
      setError(err?.response?.data?.message || 'Gagal menambahkan ke keranjang');
    }
  };

  const outOfStock = book.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/books/${book.id}`} className="relative block aspect-[2/3] overflow-hidden bg-slate-100">
        <BookCover
          src={book.cover_url}
          title={book.title}
          className="transition duration-300 group-hover:scale-105"
        />
        {book.genre?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow">
            {book.genre.name}
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
            Stok habis
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/books/${book.id}`} className="line-clamp-2 text-base font-semibold text-slate-800 hover:text-indigo-700">
          {book.title}
        </Link>
        <p className="text-sm text-slate-500">{book.author?.name || 'Penulis tidak diketahui'}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-lg font-bold text-indigo-700">{formatRupiah(book.price)}</p>
            <p className="text-xs text-slate-400">Stok: {book.stock}</p>
          </div>
          {!isAdmin && (
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock || status === 'loading'}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {outOfStock
                ? 'Habis'
                : status === 'loading'
                  ? '...'
                  : status === 'success'
                    ? '✓ Masuk'
                    : '+ Keranjang'}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
