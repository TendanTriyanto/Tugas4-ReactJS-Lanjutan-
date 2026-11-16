import React, { useEffect, useState } from 'react';
import BookCover from '../../../components/BookCover';
import { createBook, deleteBook, getBooks, updateBook } from '../../../_services/books';
import { getGenres } from '../../../_services/genres';
import { getAuthors } from '../../../_services/authors';
import { formatRupiah, getErrorMessage } from '../../../utils/format';

const emptyForm = {
  title: '',
  isbn: '',
  genre_id: '',
  author_id: '',
  price: '',
  stock: '',
  publication_year: '',
  cover_url: '',
  description: '',
};

export default function BooksAdmin() {
  const [books, setBooks] = useState({ data: [], total: 0, last_page: 1 });
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchBooks = async (targetPage = page) => {
    setLoading(true);
    try {
      const data = await getBooks({ q: keyword || undefined, page: targetPage, per_page: 10 });
      setBooks(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data buku.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, page]);

  useEffect(() => {
    Promise.all([getGenres(), getAuthors()])
      .then(([genreData, authorData]) => {
        setGenres(Array.isArray(genreData) ? genreData : []);
        setAuthors(Array.isArray(authorData) ? authorData : []);
      })
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const payload = {
        ...form,
        genre_id: form.genre_id || null,
        author_id: form.author_id || null,
        price: form.price === '' ? 0 : Number(form.price),
        stock: form.stock === '' ? 0 : Number(form.stock),
        publication_year: form.publication_year === '' ? null : Number(form.publication_year),
        isbn: form.isbn || null,
        cover_url: form.cover_url || null,
      };

      if (editingId) {
        await updateBook(editingId, payload);
        setNotice('Data buku berhasil diperbarui.');
      } else {
        await createBook(payload);
        setNotice('Buku baru berhasil ditambahkan.');
        setPage(1);
      }
      resetForm();
      setShowForm(false);
      fetchBooks(editingId ? page : 1);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan buku.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title || '',
      isbn: book.isbn || '',
      genre_id: book.genre_id || '',
      author_id: book.author_id || '',
      price: book.price ?? '',
      stock: book.stock ?? '',
      publication_year: book.publication_year || '',
      cover_url: book.cover_url || '',
      description: book.description || '',
    });
    setShowForm(true);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Hapus buku "${book.title}"?`)) return;
    try {
      await deleteBook(book.id);
      setNotice('Buku berhasil dihapus.');
      if (editingId === book.id) resetForm();
      fetchBooks(page);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus buku.'));
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setKeyword(search.trim());
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Buku</h1>
          <p className="mt-1 text-sm text-slate-500">Tambah, ubah, dan hapus data buku toko.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm((value) => !value);
          }}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {showForm && !editingId ? 'Tutup Form' : '+ Tambah Buku'}
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-800">{editingId ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Judul buku</label>
              <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required placeholder="Judul buku" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">ISBN (opsional)</label>
              <input value={form.isbn} onChange={(event) => setForm((prev) => ({ ...prev, isbn: event.target.value }))} placeholder="978-..." className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Kategori</label>
              <select value={form.genre_id} onChange={(event) => setForm((prev) => ({ ...prev, genre_id: event.target.value }))} className={inputClass}>
                <option value="">Pilih kategori</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Author</label>
              <select value={form.author_id} onChange={(event) => setForm((prev) => ({ ...prev, author_id: event.target.value }))} className={inputClass}>
                <option value="">Pilih author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tahun terbit</label>
              <input type="number" min="1000" max="2100" value={form.publication_year} onChange={(event) => setForm((prev) => ({ ...prev, publication_year: event.target.value }))} placeholder="2024" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Harga (Rp)</label>
              <input type="number" min="0" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} required placeholder="85000" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Stok</label>
              <input type="number" min="0" value={form.stock} onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))} required placeholder="20" className={inputClass} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-sm font-medium text-slate-700">URL cover (opsional)</label>
              <input value={form.cover_url} onChange={(event) => setForm((prev) => ({ ...prev, cover_url: event.target.value }))} placeholder="https://... atau /covers/namafile.svg" className={inputClass} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
              <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows="3" placeholder="Sinopsis atau deskripsi buku" className={inputClass} />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300">
              {saving ? 'Menyimpan...' : editingId ? 'Update Buku' : 'Simpan Buku'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-800">Daftar Buku ({books.total})</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul / ISBN..."
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Cari
            </button>
          </form>
        </div>

        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : books.data.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">Belum ada buku yang cocok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Buku</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Author</th>
                  <th className="px-5 py-3">Harga</th>
                  <th className="px-5 py-3">Stok</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.data.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <BookCover src={book.cover_url} title={book.title} className="h-full w-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-slate-800">{book.title}</p>
                          <p className="text-xs text-slate-400">
                            {book.isbn ? `ISBN ${book.isbn}` : 'Tanpa ISBN'}
                            {book.publication_year ? ` · ${book.publication_year}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{book.genre?.name || '-'}</td>
                    <td className="px-5 py-3 text-slate-600">{book.author?.name || '-'}</td>
                    <td className="px-5 py-3 font-medium text-slate-700">{formatRupiah(book.price)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          book.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : book.stock < 5
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(book)} className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(book)} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {books.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
            >
              ← Sebelumnya
            </button>
            <span className="text-sm text-slate-500">Halaman {books.current_page} dari {books.last_page}</span>
            <button
              type="button"
              disabled={page >= books.last_page}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
            >
              Berikutnya →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
