'use client';
import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';

import { ProgressBar } from '@/components/molecules';
import { SContainer, SJoinForm } from '@/styles/components/join';

import JoinHeader from '../JoinHeader';

export default function JoinDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const detailNum = searchParams.get('num');
  const hrefLabel = detailNum !== '1' ? '뒤로가기' : '';

  const progress = useMemo(() => {
    return [
      {
        stepNum: 1,
        currentStep: Number(detailNum) === 1,
        prevStep: Number(detailNum) > 1,
        completed: false,
        label: '관심지역',
      },
      {
        stepNum: 2,
        currentStep: Number(detailNum) === 2,
        prevStep: Number(detailNum) > 2,
        completed: false,
        label: '경력&포지션',
      },
      {
        stepNum: 3,
        currentStep: Number(detailNum) >= 3,
        prevStep: Number(detailNum) > 3,
        completed: false,
        label: `성향선택(${Number(detailNum) - 2 < 0 ? 0 : Number(detailNum) - 2}/4)`,
      },
    ];
  }, [detailNum]);

  return (
    <SContainer>
      <JoinHeader
        title="세부 프로필"
        hrefLabel={hrefLabel}
        onClickHref={() => {
          router.push(`/join/detail?num=${Number(detailNum) - 1}`);
        }}
      />
      <SJoinForm>
        <JoinDetailWrapper>
          <ProgressBarContainer>
            {progress.map((item, index) => (
              <ProgressBar
                key={item.stepNum}
                currentStep={item.currentStep}
                prevStep={item.prevStep}
                completed={item.completed}
                stepNum={item.stepNum}
                label={item.label}
                isFinal={index === progress.length - 1}
              />
            ))}
          </ProgressBarContainer>
        </JoinDetailWrapper>
      </SJoinForm>
    </SContainer>
  );
}

const JoinDetailWrapper = styled.div`
  width: 38.875rem;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
