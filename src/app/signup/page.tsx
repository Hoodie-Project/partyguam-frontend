import React from 'react';
import dynamic from 'next/dynamic';

const Join = dynamic(() => import('@/components/pages/join/Join'), {
  ssr: false,
});

export default function JoinPage() {
  return (
    <>
      <Join />
    </>
  );
}
