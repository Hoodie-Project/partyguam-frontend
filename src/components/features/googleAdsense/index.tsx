import React from 'react';
import Script from 'next/script';

export default function GoogleAdSense() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8724037414945960"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
