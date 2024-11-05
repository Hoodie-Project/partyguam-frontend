import React from 'react';
import dynamic from 'next/dynamic';

const HomeRecruitment = dynamic(() => import('@/components/pages/home/recruitment'), { ssr: false });

export default function HomeRecruitmentPage() {
  return <HomeRecruitment />;
}
