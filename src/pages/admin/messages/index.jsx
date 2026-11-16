import React, { useEffect, useState } from 'react';
import { deleteMessage, getMessages, markMessageRead } from '../../../_services/messages';
import { formatDateTime, getErrorMessage } from '../../../utils/format';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMessages(unreadOnly ? { unread_only: 1 } : {});
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat pesan.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  const handleRead = async (message) => {
    setBusyId(message.id);
    try {
      await markMessageRead(message.id);
      setMessages((prev) => prev.map((item) => (item.id === message.id ? { ...item, is_read: true } : item)));
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menandai pesan.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (message) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    setBusyId(message.id);
    try {
      await deleteMessage(message.id);
      setMessages((prev) => prev.filter((item) => item.id !== message.id));
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus pesan.'));
    } finally {
      setBusyId(null);
    }
  };

  const unreadCount = messages.filter((message) => !message.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pesan Masuk</h1>
          <p className="mt-1 text-sm text-slate-500">Pesan dari halaman Contact to Admin.</p>
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
          <input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} />
          Hanya belum dibaca
        </label>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total pesan</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-800">{messages.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Belum dibaca</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-600">{unreadCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Sudah dibaca</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">{messages.length - unreadCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-3 text-sm text-slate-500">Belum ada pesan masuk.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                message.is_read ? 'border-slate-200' : 'border-indigo-200 ring-1 ring-indigo-100'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-800">{message.subject}</h2>
                    {!message.is_read && (
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                        Baru
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {message.name} · {message.email} · {formatDateTime(message.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!message.is_read && (
                    <button
                      type="button"
                      onClick={() => handleRead(message)}
                      disabled={busyId === message.id}
                      className="rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
                    >
                      Tandai dibaca
                    </button>
                  )}
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                    className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200"
                  >
                    Balas email
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(message)}
                    disabled={busyId === message.id}
                    className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{message.message}</p>
              {message.user && (
                <p className="mt-2 text-xs text-slate-400">Terkait akun: {message.user.name} ({message.user.email})</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
