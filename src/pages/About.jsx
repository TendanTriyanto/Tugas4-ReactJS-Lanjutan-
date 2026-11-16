import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 px-6 py-12 text-white sm:px-12">
        <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm ring-1 ring-white/20">
          Tentang BookStore
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Menghubungkan pembaca dengan buku yang tepat sejak 2026.
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-indigo-100">
          BookStore adalah toko buku online sederhana yang dibangun untuk memenuhi kebutuhan
          pembaca modern: katalog yang rapi, pencarian cepat, keranjang belanja, dan
          pembayaran yang aman sebelum buku dikirim.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Misi kami</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Membuat buku berkualitas lebih mudah ditemukan dan dijangkau oleh siapa saja.
            Kami percaya bahwa satu buku yang tepat dapat mengubah cara seseorang melihat dunia.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Visi kami</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Menjadi toko buku online pilihan utama di Indonesia dengan pengalaman belanja
            yang sederhana, cepat, dan terpercaya.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Yang kami tawarkan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '📚', title: 'Koleksi beragam', desc: 'Fiksi, non-fiksi, sains, sejarah, fantasi, dan lainnya.' },
            { icon: '🔍', title: 'Pencarian cepat', desc: 'Cari berdasarkan judul, penulis, atau ISBN.' },
            { icon: '🛒', title: 'Keranjang praktis', desc: 'Simpan buku favorit dan atur jumlah sebelum checkout.' },
            { icon: '💳', title: 'Bayar saat antar', desc: 'Pembayaran dilakukan sebelum buku dikirim.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 font-semibold text-slate-800">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3 sm:p-8">
        {[
          { value: '10+', label: 'Judul buku' },
          { value: '9', label: 'Penulis' },
          { value: '8', label: 'Kategori' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-extrabold text-indigo-700">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-amber-50 p-6 ring-1 ring-amber-200 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ada pertanyaan?</h2>
          <p className="mt-1 text-sm text-slate-600">Tim admin kami siap membantu Anda.</p>
        </div>
        <Link to="/contact" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Hubungi Admin
        </Link>
      </section>
    </div>
  );
}
