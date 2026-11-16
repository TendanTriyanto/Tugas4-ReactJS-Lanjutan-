import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulasi login sederhana untuk tugas
    if (email === "admin@booksales.com" && password === "admin123") {
      localStorage.setItem('access_token', 'fake-jwt-token-admin');
      localStorage.setItem('user_role', 'admin');
      alert("Login berhasil sebagai Admin!");
      navigate('/admin/genres');
    } else {
      // Jika login sebagai user biasa
      localStorage.setItem('access_token', 'fake-jwt-token-user');
      localStorage.setItem('user_role', 'customer');
      alert("Login berhasil sebagai Customer!");
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Login SalesBook</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@booksales.com"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-600"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="******"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-600"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-slate-800 text-white p-2 rounded hover:bg-slate-700 transition"
          >
            Masuk
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          *Gunakan email <b>admin@booksales.com</b> untuk masuk sebagai admin.
        </p>
      </div>
    </div>
  );
}