import React from 'react';
import dynamic from 'next/dynamic';

const Join = dynamic(() => import('@/components/_pages/join/Join'), {
  ssr: false,
});

export default function JoinPage() {
  return (
    <>
      <Join />
    </>
  );
}
