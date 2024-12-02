import React from 'react';
import dynamic from 'next/dynamic';

const HomeMain = dynamic(() => import('@/components/pages/home/main'), { ssr: false });

export default function Home() {
  return (
    <>
      <HomeMain />
    </>
  );
}
