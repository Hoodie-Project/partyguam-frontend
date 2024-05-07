'use client';
import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { ProgressBar } from '@/components/molecules';
import { useAuthStore } from '@/stores/auth';
import { SContainer, SFlexColumnCenter, SJoinForm } from '@/styles/components';

import JoinHeader from '../JoinHeader';

import SelectLocation from './SelectLocation';
import SelectPosition from './SelectPosition';
import SelectPropensity from './SelectPropensity';

export default function JoinDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { nickname } = useAuthStore(state => state);
  const detailNum = searchParams.get('num');
  const hrefLabel = detailNum !== '1' ? '뒤로가기' : '';

  /**
   * NOTE
   * completed 제어 -> button 클릭 시 각 단계에서 api 호출을 던지고 각 단계의 결과를 알고 있을 전역 변수가 필요함
   */
  const progress = useMemo(() => {
    return [
      {
        stepNum: 1,
        currentStep: Number(detailNum) === 1,
        prevStep: Number(detailNum) > 1,
        completed: false, // api 호출 성공 시 True
        stepLabel: '관심지역',
        component: <SelectLocation />,
      },
      {
        stepNum: 2,
        currentStep: Number(detailNum) === 2,
        prevStep: Number(detailNum) > 2,
        completed: false,
        stepLabel: '경력/포지션',
        component: <SelectPosition />,
      },
      {
        stepNum: 3,
        currentStep: Number(detailNum) >= 3,
        prevStep: Number(detailNum) > 3,
        completed: false,
        stepLabel: `성향선택(${Number(detailNum) - 2 < 0 ? 0 : Number(detailNum) - 2}/4)`,
        component: <SelectPropensity />,
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
        icon={<CloseRoundedIcon />}
      />
      <SJoinForm>
        <JoinDetailWrapper>
          <ProgressContainer>
            {progress.map((item, index) => (
              <ProgressBar
                key={item.stepNum}
                currentStep={item.currentStep}
                prevStep={item.prevStep}
                completed={item.completed}
                stepNum={item.stepNum}
                label={item.stepLabel}
                isFinal={index === progress.length - 1}
              />
            ))}
          </ProgressContainer>
          {progress
            .filter(item => item.stepNum === Number(detailNum))
            .map(item => (
              <SFlexColumnCenter key={item.stepNum}>{item.component}</SFlexColumnCenter>
            ))}
        </JoinDetailWrapper>
      </SJoinForm>
    </SContainer>
  );
}

const JoinDetailWrapper = styled.div`
  width: 25rem;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
