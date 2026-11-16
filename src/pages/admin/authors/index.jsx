import React, { useEffect, useState } from 'react';
import { createAuthor, deleteAuthor, getAuthors, updateAuthor } from '../../../_services/authors';
import { getErrorMessage } from '../../../utils/format';

const emptyForm = { name: '', email: '', bio: '' };

export default function AuthorsAdmin() {
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await getAuthors();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat author.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
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
        await updateAuthor(editingId, form);
        setNotice('Author berhasil diperbarui.');
      } else {
        await createAuthor(form);
        setNotice('Author berhasil ditambahkan.');
      }
      resetForm();
      fetchAuthors();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan author.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (author) => {
    setEditingId(author.id);
    setForm({ name: author.name || '', email: author.email || '', bio: author.bio || '' });
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (author) => {
    if (!window.confirm(`Hapus author "${author.name}"?`)) return;
    try {
      await deleteAuthor(author.id);
      setNotice('Author berhasil dihapus.');
      if (editingId === author.id) resetForm();
      fetchAuthors();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus author.'));
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Data Author</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola data penulis buku.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-800">{editingId ? 'Edit Author' : 'Tambah Author Baru'}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nama author</label>
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required placeholder="Nama lengkap penulis" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email (opsional)</label>
            <input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="email@contoh.com" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Biografi (opsional)</label>
            <textarea value={form.bio} onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))} rows="2" placeholder="Biografi singkat penulis" className={inputClass} />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300">
            {saving ? 'Menyimpan...' : editingId ? 'Update Author' : 'Simpan Author'}
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
          <h2 className="font-bold text-slate-800">Daftar Author ({authors.length})</h2>
        </div>
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : authors.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">Belum ada author.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">No</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Biografi</th>
                  <th className="px-5 py-3">Buku</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {authors.map((author, index) => (
                  <tr key={author.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{author.name}</td>
                    <td className="px-5 py-3 text-slate-500">{author.email || '-'}</td>
                    <td className="max-w-xs px-5 py-3 text-slate-500">
                      <p className="line-clamp-2">{author.bio || '-'}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{author.books_count ?? 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(author)} className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(author)} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
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
