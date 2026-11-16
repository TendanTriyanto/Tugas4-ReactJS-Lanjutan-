import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // Ambil token dan role dari localStorage
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role'); // Role pengguna (misal: 'admin' atau 'customer')

  // 1. Cek apakah user sudah login (token belum ada)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Cek apakah role user diizinkan mengakses halaman ini
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Jika lolos semua pengecekan, tampilkan halamannya
  return <Outlet />;
};

export default ProtectedRoute;