'use client';
import React, { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { PageHeader, ProgressBar } from '@/components/_molecules';
import ConfirmModal from '@/components/features/comfirmModal/ConfirmModal';
import { SelectLocation, SelectPersonality, SelectPosition } from '@/components/features/detailProfile';
import { useFormContext } from '@/contexts/FormContext';
import { useModalContext } from '@/contexts/ModalContext';
import { useSelectLocationStore, useSelectPositionStore } from '@/stores/detailProfile';
import { SContainer, SFlexColumnCenter, SForm } from '@/styles/components';

export default function JoinDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const detailNum = searchParams.get('num');
  const hrefLabel = detailNum !== '1' ? '뒤로가기' : '';
  const { locationCompletion } = useSelectLocationStore();
  const { positionCompletion } = useSelectPositionStore();
  const { openModal, closeModal } = useModalContext();
  const { setFormDirty, setFormType } = useFormContext();

  useEffect(() => {
    setFormDirty(true);
    setFormType('세부프로필작성');
    return () => {
      setFormDirty(false);
      setFormType('');
    };
  }, [setFormDirty, setFormType]);

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
        completed: locationCompletion, // api 호출 성공 시 True
        stepLabel: '관심지역',
        component: <SelectLocation />,
      },
      {
        stepNum: 2,
        currentStep: Number(detailNum) === 2,
        prevStep: Number(detailNum) > 2,
        completed: positionCompletion,
        stepLabel: '경력/포지션',
        component: <SelectPosition />,
      },
      {
        stepNum: 3,
        currentStep: Number(detailNum) >= 3,
        prevStep: Number(detailNum) > 3,
        completed: false,
        stepLabel: `성향선택(${Number(detailNum) - 2 < 0 ? 0 : Number(detailNum) - 2}/4)`,
        component: <SelectPersonality />,
      },
    ];
  }, [detailNum]);

  return (
    <SContainer>
      <PageHeader
        title="세부 프로필"
        hrefLabel={hrefLabel}
        onClickHref={() => {
          router.push(`/join/detail?num=${Number(detailNum) - 1}`);
        }}
        onClickIcon={() =>
          openModal({
            children: (
              <ConfirmModal
                modalTitle="나가기"
                modalContents={
                  <>
                    입력한 내용들이 모두 초기화됩니다.
                    <br />
                    나가시겠습니까?
                  </>
                }
                cancelBtnTxt="취소"
                submitBtnTxt="나가기"
              />
            ),
            onCancel: () => {
              closeModal();
            },
            onSubmit: () => {
              router.push('/');
              closeModal();
            },
          })
        }
        icon={<CloseRoundedIcon />}
      />
      <SForm>
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
          {Number(detailNum) > 3 && <SelectPersonality />}
        </JoinDetailWrapper>
      </SForm>
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
