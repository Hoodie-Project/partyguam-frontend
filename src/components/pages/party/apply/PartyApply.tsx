'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { Button, Input, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { ConfirmModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';

export default function PartyApply() {
  const router = useRouter();
  const [applyDisabled, setApplyDisabled] = useState(true);
  const [applyReasonValue, setApplyReasonValue] = useState<string>('');
  const { openModal, closeModal } = useModalContext();

  const validateApplyValue = useMemo(() => {
    const length = applyReasonValue.length;
    if (length > 250) {
      setApplyDisabled(true);
      return 'warn';
    }
    if (length > 0 && length <= 250) {
      setApplyDisabled(false);
      return 'success';
    }
    setApplyDisabled(true);
    return 'default';
  }, [applyReasonValue]);

  const onClickCancel = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="경고!"
          modalContents={
            <>
              작성된 내용이 저장되지 않았습니다.
              <br />
              나가시겠습니까?
            </>
          }
          cancelBtnTxt="나가기"
          submitBtnTxt="작성하기"
        />
      ),
      onCancel: () => {
        router.push('/');
        closeModal();
      },
      onSubmit: () => {
        closeModal();
      },
    });
  };

  const onClickApply = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="지원 완료"
          modalContents={
            <>
              지원이 완료되었어요!
              <br />
              다른 파티도 둘러볼까요?
            </>
          }
          cancelBtnTxt="지원 목록"
          submitBtnTxt="확인"
        />
      ),
      onCancel: () => {
        // 지원 목록 어디로 이동하는지 기획 나와야함
        router.push('/');
        closeModal();
      },
      onSubmit: () => {
        // 확인 어디로 이동하는지 기획 나와야함
        router.push('/');
        closeModal();
      },
    });
  };

  return (
    <SContainer>
      <PageHeader title="파티 지원하기" />
      <PartyApplyContainer>
        <SFlexColumnFull>
          <SMargin margin="3.125rem 0rem 0rem 0rem" />
          <Txt fontSize={20} fontWeight="bold">
            지원 사유
          </Txt>
          <SMargin margin="0rem 0rem .25rem 0rem" />
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            250자 이내로 자유롭게 작성해 주세요.
          </Txt>
          <SMargin margin="1.25rem 0rem 0rem 0rem" />
          <Input.TextArea
            inputState={validateApplyValue}
            value={applyReasonValue}
            onChange={e => {
              setApplyReasonValue(e.target.value);
            }}
            onClear={() => {
              setApplyReasonValue('');
            }}
            height="20rem"
            maxCount={250}
            placeholder="지원 사유를 작성해 주세요"
            shadow="shadow1"
          />
        </SFlexColumnFull>
        <SMargin margin="4.0625rem 0rem 0rem 0rem" />
        <SFlexRowFull style={{ justifyContent: 'space-between' }}>
          <Button
            style={{ marginBottom: 60 }}
            height="l"
            width="base"
            backgroudColor="grey100"
            radius="base"
            shadow="shadow1"
            borderColor="grey200"
            onClick={onClickCancel}
          >
            <Txt fontWeight="bold" fontColor="grey400">
              취소
            </Txt>
          </Button>
          <Button
            style={{ marginBottom: 60 }}
            disabled={applyDisabled}
            height="l"
            width="base"
            backgroudColor="primaryGreen"
            radius="base"
            shadow="shadow1"
            onClick={onClickApply}
          >
            <Txt fontWeight="bold" fontColor={applyDisabled ? 'grey400' : 'black'}>
              생성하기
            </Txt>
          </Button>
        </SFlexRowFull>
      </PartyApplyContainer>
    </SContainer>
  );
}
const PartyApplyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 820px;
  height: auto;
  margin-top: calc(50px + 56px);
`;
