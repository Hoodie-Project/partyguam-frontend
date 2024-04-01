import React from 'react';
import dynamic from 'next/dynamic';

import { Main } from '@/components/templates';

const Header = dynamic(() => import('@/components/organisms/header'));

export default function Home() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}
