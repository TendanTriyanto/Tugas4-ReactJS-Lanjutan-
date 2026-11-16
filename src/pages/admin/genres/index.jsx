import React, { useEffect, useState } from 'react';
import { createGenre, deleteGenre, getGenres, updateGenre } from '../../../_services/genres';
import { getErrorMessage } from '../../../utils/format';

const emptyForm = { name: '', description: '' };

export default function GenresAdmin() {
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const data = await getGenres();
      setGenres(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat kategori.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
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
      if (editingId) {
        await updateGenre(editingId, form);
        setNotice('Kategori berhasil diperbarui.');
      } else {
        await createGenre(form);
        setNotice('Kategori berhasil ditambahkan.');
      }
      resetForm();
      fetchGenres();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan kategori.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (genre) => {
    setEditingId(genre.id);
    setForm({ name: genre.name || '', description: genre.description || '' });
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (genre) => {
    if (!window.confirm(`Hapus kategori "${genre.name}"? Buku pada kategori ini tidak ikut terhapus.`)) {
      return;
    }
    try {
      await deleteGenre(genre.id);
      setNotice('Kategori berhasil dihapus.');
      if (editingId === genre.id) resetForm();
      fetchGenres();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus kategori.'));
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kategori Buku</h1>
        <p className="mt-1 text-sm text-slate-500">Tambah, ubah, dan hapus kategori buku.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-800">{editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nama kategori</label>
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required placeholder="Contoh: Fiksi" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi (opsional)</label>
            <input value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Deskripsi singkat kategori" className={inputClass} />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300">
            {saving ? 'Menyimpan...' : editingId ? 'Update Kategori' : 'Simpan Kategori'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-800">Daftar Kategori ({genres.length})</h2>
        </div>
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : genres.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">Belum ada kategori. Tambahkan kategori pertama.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">No</th>
                  <th className="px-5 py-3">Nama Kategori</th>
                  <th className="px-5 py-3">Deskripsi</th>
                  <th className="px-5 py-3">Jumlah Buku</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {genres.map((genre, index) => (
                  <tr key={genre.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{genre.name}</td>
                    <td className="px-5 py-3 text-slate-500">{genre.description || '-'}</td>
                    <td className="px-5 py-3 text-slate-600">{genre.books_count ?? 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(genre)} className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(genre)} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
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
      </div>
    </div>
  );
}
