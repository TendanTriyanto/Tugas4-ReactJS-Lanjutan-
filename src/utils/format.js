export const formatRupiah = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const getErrorMessage = (error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') => {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (data.message) return data.message;
  if (data.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) return first[0];
  }
  return fallback;
};

export const ORDER_STATUS = {
  pending: { label: 'Menunggu', className: 'bg-amber-100 text-amber-800' },
  processing: { label: 'Diproses', className: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Dikirim', className: 'bg-indigo-100 text-indigo-800' },
  completed: { label: 'Selesai', className: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' },
};

export const PAYMENT_STATUS = {
  unpaid: { label: 'Belum Dibayar', className: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Lunas', className: 'bg-emerald-100 text-emerald-800' },
  failed: { label: 'Gagal', className: 'bg-red-100 text-red-800' },
};

export const PAYMENT_METHOD = {
  cod: 'Payment at Delivery (COD)',
  midtrans: 'Midtrans',
};

export const statusBadge = (map, value) => map[value] || { label: value, className: 'bg-gray-100 text-gray-700' };
