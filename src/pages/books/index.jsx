import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../../components/BookCard';
import { getBooks } from '../../_services/books';
import { getGenres } from '../../_services/genres';

export default function BooksIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const genreId = searchParams.get('genre_id') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  const [search, setSearch] = useState(keyword);
  const [genres, setGenres] = useState([]);
  const [result, setResult] = useState({ data: [], total: 0, last_page: 1, from: 0, to: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getGenres()
      .then((data) => setGenres(Array.isArray(data) ? data : []))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    setSearch(keyword);
  }, [keyword]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getBooks({
      q: keyword || undefined,
      genre_id: genreId || undefined,
      sort,
      page,
      per_page: 12,
    })
      .then((data) => {
        if (active) setResult(data);
      })
      .catch(() => {
        if (active) setError('Gagal memuat daftar buku.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [keyword, genreId, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParam('q', search.trim());
  };

  const activeGenre = genres.find((genre) => String(genre.id) === String(genreId));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white sm:px-10">
        <h1 className="text-3xl font-bold">Koleksi Buku</h1>
        <p className="mt-2 max-w-xl text-sm text-indigo-100">
          Cari buku berdasarkan judul, penulis, atau ISBN. Gunakan filter kategori untuk
          mempersempit pilihan.
        </p>

        <form onSubmit={handleSearch} className="mt-5 flex max-w-xl gap-2 rounded-2xl bg-white p-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari judul, penulis, atau ISBN..."
            className="w-full rounded-xl px-3 py-2 text-sm text-slate-800 outline-none"
          />
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Cari
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Kategori</h2>
              {genreId && (
                <button
                  type="button"
                  onClick={() => updateParam('genre_id', '')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
              <button
                type="button"
                onClick={() => updateParam('genre_id', '')}
                className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                  !genreId ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Semua kategori
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => updateParam('genre_id', genre.id)}
                  className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                    String(genreId) === String(genre.id)
                      ? 'bg-indigo-50 font-semibold text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-slate-500">
                Urutkan
              </label>
              <select
                value={sort}
                onChange={(event) => updateParam('sort', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                <option value="newest">Terbaru</option>
                <option value="title">Judul A-Z</option>
                <option value="price_asc">Harga termurah</option>
                <option value="price_desc">Harga termahal</option>
              </select>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-500">
              {keyword ? (
                <>
                  Hasil pencarian untuk <b className="text-slate-800">&ldquo;{keyword}&rdquo;</b>
                </>
              ) : activeGenre ? (
                <>Kategori <b className="text-slate-800">{activeGenre.name}</b></>
              ) : (
                'Menampilkan semua buku'
              )}
            </p>
            {!loading && <p className="text-sm text-slate-500">{result.total} buku ditemukan</p>}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : result.data.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-4xl">🔎</p>
              <h2 className="mt-3 font-semibold text-slate-800">Buku tidak ditemukan</h2>
              <p className="mt-1 text-sm text-slate-500">
                Coba kata kunci lain atau reset filter kategori.
              </p>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Tampilkan semua buku
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.data.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {result.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateParam('page', page - 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 disabled:opacity-40"
              >
                ← Sebelumnya
              </button>
              <span className="px-3 text-sm text-slate-500">
                Halaman {page} dari {result.last_page}
              </span>
              <button
                type="button"
                disabled={page >= result.last_page}
                onClick={() => updateParam('page', page + 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 disabled:opacity-40"
              >
                Berikutnya →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
