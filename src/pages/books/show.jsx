import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BookCard from '../../components/BookCard';
import BookCover from '../../components/BookCover';
import { getBook, getBooks } from '../../_services/books';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatRupiah, getErrorMessage } from '../../utils/format';

export default function BookDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [adding, setAdding] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setQty(1);

    getBook(id)
      .then((data) => {
        if (!active) return;
        setBook(data);
        if (data.genre_id) {
          getBooks({ genre_id: data.genre_id, per_page: 4 })
            .then((res) => {
              if (active) setRelated((res.data || []).filter((item) => item.id !== data.id).slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        if (active) setError('Buku tidak ditemukan.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleAdd = async (redirect) => {
    if (!user) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }
    setError('');
    setAdding(redirect ? 'buy' : 'cart');
    try {
      await add(book.id, qty);
      if (redirect) {
        navigate('/cart');
      } else {
        setNotice('Buku berhasil ditambahkan ke keranjang.');
        window.setTimeout(() => setNotice(''), 2500);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menambahkan buku ke keranjang.'));
    } finally {
      setAdding('');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200 lg:col-span-1" />
          <div className="space-y-3 lg:col-span-2">
            <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-32 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">📕</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{error}</h1>
        <Link to="/books" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
          Kembali ke koleksi
        </Link>
      </div>
    );
  }

  const outOfStock = book.stock <= 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600">Beranda</Link>
        <span>/</span>
        <Link to="/books" className="hover:text-indigo-600">Koleksi Buku</Link>
        <span>/</span>
        <span className="truncate text-slate-800">{book.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-slate-100">
            <BookCover src={book.cover_url} title={book.title} className="h-full w-full" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {book.genre?.name && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {book.genre.name}
              </span>
            )}
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${outOfStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {outOfStock ? 'Stok habis' : `Stok tersedia: ${book.stock}`}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">{book.title}</h1>
          <p className="mt-2 text-slate-500">
            oleh <span className="font-semibold text-slate-700">{book.author?.name || 'Penulis tidak diketahui'}</span>
            {book.publication_year ? ` · ${book.publication_year}` : ''}
            {book.isbn ? ` · ISBN ${book.isbn}` : ''}
          </p>

          <p className="mt-6 text-3xl font-extrabold text-indigo-700">{formatRupiah(book.price)}</p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Deskripsi</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {book.description || 'Belum ada deskripsi untuk buku ini.'}
            </p>
          </div>

          {notice && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {notice}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isAdmin ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="px-4 py-2.5 text-slate-600 hover:text-indigo-600"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.min(book.stock || 1, value + 1))}
                  className="px-4 py-2.5 text-slate-600 hover:text-indigo-600"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={outOfStock || Boolean(adding)}
                onClick={() => handleAdd(false)}
                className="rounded-xl border border-indigo-600 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding === 'cart' ? 'Menambahkan...' : '+ Keranjang'}
              </button>
              <button
                type="button"
                disabled={outOfStock || Boolean(adding)}
                onClick={() => handleAdd(true)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {adding === 'buy' ? 'Memproses...' : 'Beli Sekarang'}
              </button>
            </div>
          ) : (
            <Link
              to="/admin/books"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Kelola buku ini di dashboard
            </Link>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900">Buku terkait</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BookCard key={item.id} book={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
