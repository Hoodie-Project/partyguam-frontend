import React from 'react';
import dynamic from 'next/dynamic';

const MyAccountDelete = dynamic(() => import('@/components/pages/my/account-delete'), { ssr: false });

export default function MyAccountDeletePage() {
  return (
    <>
      <MyAccountDelete />
    </>
  );
}
