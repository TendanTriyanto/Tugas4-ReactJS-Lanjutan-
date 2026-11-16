import React, { useEffect, useMemo, useState } from 'react';

const MAX_RETRY = 2;

function withRetryParam(src, attempt) {
  if (!src || attempt === 0 || /^(data|blob):/i.test(src)) return src;
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}cover_retry=${attempt}`;
}

export default function BookCover({
  src,
  title = 'Buku',
  className = '',
  fit = 'object-cover',
}) {
  const cleanSrc = typeof src === 'string' ? src.trim() : '';
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
  }, [cleanSrc]);

  const imageSrc = useMemo(() => withRetryParam(cleanSrc, attempt), [cleanSrc, attempt]);

  if (!cleanSrc || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-900 p-4 text-center text-sm font-semibold leading-snug text-white ${className}`}
      >
        {title}
      </div>
    );
  }

  return (
    <img
      key={imageSrc}
      src={imageSrc}
      alt={title}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (attempt < MAX_RETRY) {
          setAttempt((current) => current + 1);
        } else {
          setFailed(true);
        }
      }}
      className={`h-full w-full ${fit} ${className}`}
    />
  );
}
