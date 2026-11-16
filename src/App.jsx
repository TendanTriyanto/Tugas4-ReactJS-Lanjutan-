import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import GenresAdmin from "./pages/admin/genres/index";
import AuthorsAdmin from "./pages/admin/authors/index";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar Hanya Muncul Jika Bukan di Halaman Login */}
      {!isLoginPage && (
        <aside className="w-64 bg-slate-800 text-white p-5 flex flex-col gap-4">
          <h1 className="text-xl font-bold mb-4">Booksales Admin</h1>
          <Link to="/admin/genres" className="hover:bg-slate-700 p-2 rounded">
            Manajemen Genre
          </Link>
          <Link to="/admin/authors" className="hover:bg-slate-700 p-2 rounded">
            Manajemen Author
          </Link>
        </aside>
      )}

      {/* Konten Utama */}
      <main className="flex-1 p-6 flex items-center justify-center">
        <Routes>
          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />

          {/* Root mengarah ke login atau admin */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rute Khusus Admin yang diproteksi */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/genres" element={<GenresAdmin />} />
            <Route path="/admin/authors" element={<AuthorsAdmin />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}