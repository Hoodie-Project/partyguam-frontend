import React from 'react';
import dynamic from 'next/dynamic';

const HomeGuild = dynamic(() => import('@/components/pages/home/guild'), { ssr: false });

export default function HomeGuildPage() {
  return (
    <>
      <HomeGuild />
    </>
  );
}
