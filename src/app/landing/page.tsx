import React from 'react';
import dynamic from 'next/dynamic';

const Landing = dynamic(() => import('@/components/pages/landing'), { ssr: false });

export default function LandingPage() {
  return (
    <>
      <Landing />
    </>
  );
}
