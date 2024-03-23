import React from 'react';
import dynamic from 'next/dynamic';

import Join from '@/components/templates/join';

const Header = dynamic(() => import('@/components/organisms/header'));

export default function JoinPage() {
  return (
    <>
      <Header />
      <Join />
    </>
  );
}
