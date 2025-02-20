'use client';
import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';

import { fetchPostApplyParty } from '@/apis/party';
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

  const searchParams = useSearchParams();
  const partyId = searchParams.get('partyId');
  const recruitId = searchParams.get('recruitId');

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
          modalTitle="나가기"
          modalContents={
            <>
              파티 지원이 완료되지 않았어요.
              <br />
              입력하신 내용이 있으면 저장되지 않아요!
              <br />
              그래도 해당 페이지에서 정말 나가시겠어요?
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
    });
  };

  const onClickApply = async () => {
    try {
      // TODO. 파티 리스트 페이지에서 partyId, partyRecruitmentId를 뽑아와야 하기에 api 수정 필요
      const res = await fetchPostApplyParty({
        partyId: Number(partyId),
        partyRecruitmentId: Number(recruitId),
        body: { message: applyReasonValue },
      });
      console.log('[RESPONSE POST APPLY PARTY]', res);
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
          router.push('/my/apply');
          closeModal();
        },
        onSubmit: () => {
          // 확인 어디로 이동하는지 기획 나와야함
          router.push('/');
          closeModal();
        },
      });
    } catch (error) {
      const err = error as { status?: number };

      if (err.status === 409) {
        openModal({
          children: (
            <ConfirmModal
              modalTitle="중복 지원"
              modalContents={<>이미 지원했던 공고예요!</>}
              submitBtnTxt="홈으로 가기"
            />
          ),
          onSubmit: () => {
            // 확인 어디로 이동하는지 기획 나와야함
            router.push('/');
            closeModal();
          },
        });
      }
      console.error('Error Apply party:', err);
    }
  };

  return (
    <SContainer>
      <PageHeader title="파티 지원" />
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
            backgroudColor="white"
            borderColor="primaryGreen"
            radius="base"
            shadow="shadow1"
            onClick={onClickCancel}
          >
            <Txt fontWeight="bold">취소</Txt>
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
              지원하기
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
  margin-top: calc(50px + 56px);
`;
