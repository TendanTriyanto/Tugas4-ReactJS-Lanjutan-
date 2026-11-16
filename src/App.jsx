import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import BooksIndex from './pages/books/index';
import BookDetail from './pages/books/show';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/Dashboard';
import BooksAdmin from './pages/admin/books/index';
import GenresAdmin from './pages/admin/genres/index';
import AuthorsAdmin from './pages/admin/authors/index';
import OrdersAdmin from './pages/admin/orders/index';
import UsersAdmin from './pages/admin/users/index';
import MessagesAdmin from './pages/admin/messages/index';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="/books" element={<BooksIndex />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<BooksAdmin />} />
                <Route path="genres" element={<GenresAdmin />} />
                <Route path="authors" element={<AuthorsAdmin />} />
                <Route path="orders" element={<OrdersAdmin />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
              </Route>
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
