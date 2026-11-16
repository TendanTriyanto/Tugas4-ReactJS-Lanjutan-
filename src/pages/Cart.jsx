import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover';
import { useCart } from '../context/CartContext';
import { formatRupiah, getErrorMessage } from '../utils/format';

export default function Cart() {
  const { cart, loading, updateQty, remove } = useCart();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const changeQty = async (item, nextQty) => {
    if (nextQty < 1) return;
    setBusyId(item.id);
    setError('');
    try {
      await updateQty(item.id, nextQty);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memperbarui jumlah.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (item) => {
    setBusyId(item.id);
    setError('');
    try {
      await remove(item.id);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus item.'));
    } finally {
      setBusyId(null);
    }
  };

  if (loading && cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Keranjang masih kosong</h1>
        <p className="mt-2 text-sm text-slate-500">
          Yuk jelajahi koleksi buku dan tambahkan buku favoritmu ke keranjang.
        </p>
        <Link to="/books" className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          Jelajahi Buku
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Keranjang Belanja</h1>
      <p className="mt-1 text-sm text-slate-500">{cart.count} buku di keranjang Anda.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => {
            const book = item.book;
            if (!book) return null;
            return (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <Link to={`/books/${book.id}`} className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <BookCover src={book.cover_url} title={book.title} className="h-full w-full" />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/books/${book.id}`} className="line-clamp-2 font-semibold text-slate-800 hover:text-indigo-700">
                        {book.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">{book.author?.name || 'Penulis tidak diketahui'}</p>
                      <p className="mt-2 text-sm font-bold text-indigo-700">{formatRupiah(book.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      disabled={busyId === item.id}
                      className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => changeQty(item, item.qty - 1)}
                        disabled={busyId === item.id || item.qty <= 1}
                        className="px-3 py-1.5 text-slate-600 disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(item, item.qty + 1)}
                        disabled={busyId === item.id || item.qty >= book.stock}
                        className="px-3 py-1.5 text-slate-600 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Subtotal: {formatRupiah(book.price * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Ringkasan</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Jumlah buku</span>
                <span>{cart.count}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatRupiah(cart.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkir</span>
                <span className="text-emerald-600">Gratis</span>
              </div>
              <div className="border-t border-slate-200 pt-3" />
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="text-indigo-700">{formatRupiah(cart.total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-5 block rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Lanjut ke Checkout
            </Link>
            <Link to="/books" className="mt-2 block rounded-xl border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50">
              Lanjut belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
