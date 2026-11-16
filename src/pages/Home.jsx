import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import BookCover from '../components/BookCover';
import { getBooks } from '../_services/books';
import { getGenres } from '../_services/genres';

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([getBooks({ per_page: 8, sort: 'newest' }), getGenres()])
      .then(([bookData, genreData]) => {
        if (!active) return;
        setBooks(bookData.data || []);
        setGenres(Array.isArray(genreData) ? genreData : []);
      })
      .catch(() => {
        if (active) setBooks([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = keyword.trim();
    navigate(query ? `/books?q=${encodeURIComponent(query)}` : '/books');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/20">
              ✨ Toko buku online terpercaya
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
              Baca lebih banyak, <br />
              <span className="text-amber-300">tumbuh lebih jauh.</span>
            </h1>
            <p className="mt-5 max-w-lg leading-relaxed text-indigo-100">
              Jelajahi koleksi buku fiksi, non-fiksi, sains, sejarah, dan banyak lagi.
              Pesan sekarang, bayar saat buku diantar ke tangan Anda.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-md gap-2 rounded-2xl bg-white p-2 shadow-lg">
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Cari judul buku atau penulis..."
                className="w-full rounded-xl px-3 py-2 text-sm text-slate-800 outline-none"
              />
              <button type="submit" className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Cari Buku
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {genres.slice(0, 4).map((genre) => (
                <Link
                  key={genre.id}
                  to={`/books?genre_id=${genre.id}`}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-indigo-50 transition hover:bg-white/20"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {(books.length ? books.slice(0, 4) : Array.from({ length: 4 })).map((book, index) =>
                book ? (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className={`group overflow-hidden rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur transition hover:-translate-y-1 ${
                      index % 2 === 1 ? 'translate-y-6' : ''
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-900/60">
                      <BookCover
                        src={book.cover_url}
                        title={book.title}
                        fit="object-contain"
                        className="p-1 transition group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 line-clamp-1 text-sm font-semibold">{book.title}</p>
                    <p className="text-xs text-indigo-200">{book.author?.name}</p>
                  </Link>
                ) : (
                  <div key={index} className={`h-64 animate-pulse rounded-2xl bg-white/10 ${index % 2 === 1 ? 'translate-y-6' : ''}`} />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6">
        {[
          { icon: '🚚', title: 'Pembayaran saat antar', desc: 'Bayar setelah buku dipastikan siap dikirim.' },
          { icon: '📦', title: 'Stok selalu update', desc: 'Data buku dan stok dikelola langsung oleh admin.' },
          { icon: '💬', title: 'Admin responsif', desc: 'Kirim pertanyaan lewat halaman kontak kapan saja.' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-2xl">{item.icon}</span>
            <h3 className="mt-3 font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Kategori */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Kategori pilihan</h2>
            <p className="mt-1 text-sm text-slate-500">Temukan buku sesuai minatmu.</p>
          </div>
          <Link to="/books" className="text-sm font-semibold text-indigo-600 hover:underline">
            Lihat semua →
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              to={`/books?genre_id=${genre.id}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
            >
              {genre.name}
              <span className="ml-2 text-xs text-slate-400">{genre.books_count ?? 0}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Buku terbaru */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Buku terbaru</h2>
            <p className="mt-1 text-sm text-slate-500">Koleksi terbaru yang baru ditambahkan admin.</p>
          </div>
          <Link to="/books" className="text-sm font-semibold text-indigo-600 hover:underline">
            Semua buku →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            Belum ada buku. Admin dapat menambahkan buku melalui dashboard.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-slate-900 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Punya pertanyaan tentang buku?</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-800/80">
                Hubungi admin kami melalui halaman kontak. Kami akan membantu memilih buku
                yang tepat untukmu.
              </p>
            </div>
            <Link
              to="/contact"
              className="shrink-0 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Hubungi Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
