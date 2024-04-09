import React from 'react';
import dynamic from 'next/dynamic';

const JoinSuccess = dynamic(() => import('@/components/templates/join/JoinSuccess'), { ssr: false });

export default function JoinSuccessPage() {
  return (
    <>
      <JoinSuccess />
    </>
  );
}
