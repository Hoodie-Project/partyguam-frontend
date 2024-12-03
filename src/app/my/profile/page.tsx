import React from 'react';
import dynamic from 'next/dynamic';

const MyProfile = dynamic(() => import('@/components/pages/my/profile'), { ssr: false });

export default function MyProfilePage() {
  return (
    <>
      <MyProfile />
    </>
  );
}
