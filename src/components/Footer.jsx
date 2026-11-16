import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg text-white">📚</span>
            <span className="text-lg font-bold text-white">
              Book<span className="text-indigo-400">Store</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            Toko buku online yang menyediakan koleksi buku berkualitas dari penulis Indonesia dan mancanegara.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigasi</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Beranda</Link></li>
            <li><Link to="/books" className="hover:text-white">Koleksi Buku</Link></li>
            <li><Link to="/about" className="hover:text-white">Tentang Kami</Link></li>
            <li><Link to="/contact" className="hover:text-white">Hubungi Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Kontak</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>📍 Jl. Merdeka No. 1, Jakarta</li>
            <li>📞 0812-3456-7890</li>
            <li>✉️ admin@booksales.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} BookStore. Dibuat untuk tugas Junior Web Developer.
      </div>
    </footer>
  );
}
