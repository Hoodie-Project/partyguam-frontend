'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { publicApi } from '@/apis';

export default function KakaoAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const handleKakaoAuth = async () => {
      if (code) {
        try {
          await publicApi.get(`/user/kakao/callback?code=${code}`);
        } catch (error) {
          console.error('Error during Kakao authentication:', error);
        }
      }
    };

    handleKakaoAuth();
  }, [code, router]);
  return <></>;
}
