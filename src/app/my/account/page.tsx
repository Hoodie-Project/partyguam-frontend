import React from 'react';
import dynamic from 'next/dynamic';

const MyAccount = dynamic(() => import('@/components/pages/my/account'), { ssr: false });

export default function MyAccountPage() {
  return (
    <>
      <MyAccount />
    </>
  );
}
