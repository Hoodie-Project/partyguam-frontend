'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { fetchGetPositions } from '@/apis/detailProfile';
import { fetchPartyRecruitmentDetails, fetchPostRecruitmentParty, fetchUpdatePartyRecruitment } from '@/apis/party';
import { Button, Input, Txt } from '@/components/_atoms';
import { BreadCrumb, PageHeader, Select, TipBox } from '@/components/_molecules';
import { ConfirmModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';
import { useEditPartyRecruitForm } from '@/stores/party/useAddPartyRecruit';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';
import type { Position } from '@/types/user';

import PartyRecruitDetail from '../[recruitId]';

export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  const uniqueMainPositions = Array.from(new Set(data.map(item => item.main)));
  return uniqueMainPositions.map((main, index) => {
    const position = data.find(item => item.main === main);
    return { id: position ? position.id : index + 1, label: main };
  });
};

const filterPositions = (data: Position[], mainCategory: string): { id: number; label: string }[] => {
  return data.filter(item => item.main === mainCategory).map(item => ({ id: item.id, label: item.sub }));
};

function PartyRecruitEdit() {
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const searchParams = useSearchParams();
  const partyId = searchParams.get('partyId');
  const pageType = searchParams.get('type'); // 'ADD': 추가, 'MODIFY': 수정
  const recruitId = searchParams.get('recruitId'); // 모집 공고 Id
  const mainPosition = searchParams.get('main'); // 직군
  const subPosition = searchParams.get('sub'); // 직무

  const { editPartyRecruitForm, setEditPartyRecruitForm } = useEditPartyRecruitForm();

  const [positionData, setPositionData] = useState<Position[]>([]);
  const positionList = useMemo(() => transformPositionData(positionData), [positionData]);

  const 모집소개글InputState = useMemo(() => {
    if (editPartyRecruitForm.content.length > 500) return 'warn';
    if (editPartyRecruitForm.content.length > 0 && editPartyRecruitForm.content.length <= 500) return 'success';
    return 'default';
  }, [editPartyRecruitForm.content]);

  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions();
      setPositionData(response);
    })();

    if (pageType === 'MODIFY' && recruitId) {
      (async () => {
        try {
          const recruitmentDetails = await fetchPartyRecruitmentDetails(Number(recruitId));
          if (recruitmentDetails) {
            setEditPartyRecruitForm({
              positionId: recruitmentDetails.positionId || 3,
              직군: recruitmentDetails.main,
              직무: recruitmentDetails.sub,
              recruiting_count: recruitmentDetails.recruitingCount.toString(),
              content: recruitmentDetails.content,
            });
          }
        } catch (error) {
          console.error('[Error fetching recruitment details]', error);
        }
      })();
    }
  }, [pageType, recruitId, setEditPartyRecruitForm]);

  const handleSelectChange =
    (field: string, options?: { id: number; label: string }[]) => (e: React.MouseEvent<HTMLLIElement>) => {
      const selectedOption = options?.find(option => option.label === e.currentTarget.textContent);

      setEditPartyRecruitForm({
        ...editPartyRecruitForm,
        positionId: field === '직무' ? selectedOption?.id || 0 : editPartyRecruitForm.positionId,
        [field]: e.currentTarget.textContent || '',
      });
    };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditPartyRecruitForm({
      ...editPartyRecruitForm,
      [field]: value,
    });
  };

  const isAllFieldsFilled = useMemo(() => {
    return (
      editPartyRecruitForm.직군 &&
      editPartyRecruitForm.직무 &&
      editPartyRecruitForm.recruiting_count &&
      editPartyRecruitForm.content
    );
  }, [editPartyRecruitForm]);

  const onClickCancel = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="나가기"
          modalContents={
            <>
              {pageType === 'ADD' ? '모집 추가가 완료되지 않았어요.' : '모집 수정이 완료되지 않았어요.'}
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
      onCancel: closeModal,
      onSubmit: () => {
        router.push('/');
        closeModal();
      },
    });
  };

  const onClickApply = () => {
    openModal({
      children: (
        <ConfirmModal modalTitle="등록 완료" modalContents={<div>모집공고가 등록되었어요!</div>} submitBtnTxt="닫기" />
      ),
      onCancel: closeModal,
      onSubmit: () => {
        router.back();
        closeModal();
      },
    });
  };

  const onClick미리보기Button = (recruitId: number) => {
    openModal({
      children: (
        <PreviewModalContainer>
          <CloseRoundedIcon
            style={{ position: 'absolute', top: '32px', right: '32px' }}
            onClick={() => {
              closeModal();
            }}
          />
          <PartyRecruitDetail
            recruitId={recruitId.toString()}
            isReadOnly={true}
            pageModalType={pageType?.toString() as 'ADD' | 'MODIFY'}
          />
        </PreviewModalContainer>
      ),
      onCancel: () => {
        closeModal();
      },
      onSubmit: () => {
        closeModal();
      },
    });
  };

  // 모집 추가 및 수정 핸들러
  const handleSubmitRecruitButton = async () => {
    try {
      const transformBodyData = {
        positionId: editPartyRecruitForm.positionId,
        content: editPartyRecruitForm.content,
        recruiting_count: parseInt(editPartyRecruitForm.recruiting_count, 10),
      };

      let res;
      if (pageType === 'ADD') {
        res = await fetchPostRecruitmentParty({
          partyId: Number(partyId),
          ...transformBodyData,
        });
        console.log('[POST 파티원 모집 등록]', res);
      } else if (pageType === 'MODIFY') {
        res = await fetchUpdatePartyRecruitment({
          partyId: Number(partyId),
          partyRecruitmentId: Number(recruitId),
          ...transformBodyData,
        });
        console.log('[PATCH 파티원 모집 수정]', res);
      }

      onClickApply();
    } catch (e) {
      console.error('[Error 파티원 모집 처리]', e);
    }
  };

  return (
    <SContainer>
      <PageHeader title={pageType === 'ADD' ? '모집 추가' : '모집 수정'} />
      <BreadCrumb contents={['모집 관리', '모집 수정', `${mainPosition} ${subPosition}`]} />
      <PartyRecruitContainer>
        <SFlexColumnFull>
          <SMargin margin="3.125rem 0rem 0rem 0rem" />
          <Txt fontSize={20} fontWeight="bold">
            모집 포지션
          </Txt>
          <SMargin margin="0rem 0rem .25rem 0rem" />
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            모집하시는 포지션을 입력해 주세요.
          </Txt>
          <SFlexColumnFull style={{ gap: 20 }}>
            <SFlexRowFull
              style={{ position: 'relative', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
            >
              <Select
                placeholder="직군"
                height="l"
                options={positionList}
                value={editPartyRecruitForm.직군}
                onClick={handleSelectChange('직군', positionList)}
              />
              <Select
                placeholder="직무"
                height="l"
                options={filterPositions(positionData, editPartyRecruitForm.직군)}
                value={editPartyRecruitForm.직무}
                onClick={handleSelectChange('직무', filterPositions(positionData, editPartyRecruitForm.직군))}
              />
            </SFlexRowFull>
          </SFlexColumnFull>

          {/* 모집 인원 */}
          <SFlexColumnFull>
            <SMargin margin="3.125rem 0rem 0rem 0rem" />
            <Txt fontSize={20} fontWeight="bold">
              모집 인원
            </Txt>
            <SMargin margin="0rem 0rem .25rem 0rem" />
            <Txt fontSize={16} style={{ marginBottom: 20 }}>
              모집하시는 인원을 입력해 주세요.
            </Txt>
            <div style={{ width: '50%', paddingRight: '10px' }}>
              <Select
                placeholder="인원 선택"
                height="l"
                options={Array.from({ length: 10 }, (_, i) => ({ id: i + 1, label: (i + 1).toString() }))}
                value={editPartyRecruitForm.recruiting_count}
                onClick={handleSelectChange('recruiting_count')}
              />
            </div>
          </SFlexColumnFull>

          {/* 모집 소개 글 */}
          <SFlexColumnFull>
            <SMargin margin="3.125rem 0rem 0rem 0rem" />
            <Txt fontSize={20} fontWeight="bold">
              모집 소개 글
            </Txt>
            <SMargin margin="0px 0px 4px 0px" />
            <Txt fontSize={16} style={{ marginBottom: 20 }}>
              파티의 방향성, 참고사항 등을 자유롭게 적어 주세요.
            </Txt>
            <TipBox
              shadowKey="shadow1"
              width="100%"
              height="92px"
              backgroundColor="grey100"
              borderColor="grey200"
              radiusKey="base"
              chipFontColor="white"
              chipSize="small"
              chipLabel="TIP"
              chipFontWeight="semibold"
              chipFontSize={16}
              chipColor="primaryGreen"
              chipHeight="20px"
              chipWidth="41px"
              titleText={
                <TipBox.Txt fontWeight="semibold" fontSize={16} fontColor="grey600">
                  내용을 추천해 드려요.
                </TipBox.Txt>
              }
              contentText={
                <TipBox.Txt fontWeight="normal" fontSize={16} fontColor="grey600">
                  현재 파티의 진행상태는 어떤가요? 어떤 사람을 구인하시나요? (툴, 포트폴리오 등){' '}
                </TipBox.Txt>
              }
            />
            <SMargin margin="10px" />
            <Input.TextArea
              height="320px"
              maxCount={500}
              inputState={모집소개글InputState}
              onChange={handleInputChange('content')}
              onClear={() => setEditPartyRecruitForm({ ...editPartyRecruitForm, content: '' })}
              value={editPartyRecruitForm.content}
              placeholder="안녕하세요👋 앱 개발자 팀원을 모집하고 있씁니다!
            &#13;&#10;저희 팀의 앱 개발 담당 팀원이 회사 업무로 인해 프로젝트에 참여할 수 없게 되어, 새로운 팀원을 모집하게 되었습니다.
            &#13;&#10;현재 앱 개발은 Flutter를 사용하여 회원가입, 추가 회원 정보 기입, 로그인 기능까지 구현된 상태입니다.
            &#13;&#10;앱이 많이 진행된 상황이 아니기에 앱 프로젝트에 관심이 있으신 분들은 Flutter 경험이 없더라도, Android(Kotlin) 또는 iOS(Swift) 가능하시면, Android 또는 iOS 개발자로 지원하셔도 됩니다."
            />
          </SFlexColumnFull>
        </SFlexColumnFull>
        <SMargin margin="146px 0px 0px 0px" />
        <SFlexRowFull style={{ justifyContent: 'space-between' }}>
          <Button
            style={{ marginBottom: 60 }}
            height="l"
            width="m"
            backgroudColor="white"
            radius="base"
            shadow="shadow1"
            borderColor="primaryGreen"
            onClick={onClickCancel}
          >
            <Txt fontWeight="bold">취소</Txt>
          </Button>
          <Button
            style={{ marginBottom: 60 }}
            height="l"
            width="m"
            backgroudColor="white"
            radius="base"
            shadow="shadow1"
            borderColor="primaryGreen"
            onClick={() => onClick미리보기Button(Number(partyId))}
          >
            <Txt fontWeight="bold">미리보기</Txt>
          </Button>
          <Button
            style={{ marginBottom: 60 }}
            height="l"
            width="base"
            backgroudColor="primaryGreen"
            radius="base"
            shadow="shadow1"
            disabled={!isAllFieldsFilled}
            onClick={handleSubmitRecruitButton}
          >
            <Txt fontWeight="bold" fontColor={!isAllFieldsFilled ? 'grey400' : 'black'}>
              {pageType == 'ADD' ? '모집하기' : '수정완료'}
            </Txt>
          </Button>
        </SFlexRowFull>
      </PartyRecruitContainer>
    </SContainer>
  );
}

export default PartyRecruitEdit;

const PartyRecruitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 820px;
  height: auto;
  margin-top: 50px;
`;

const PreviewModalContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: 32px;
  width: 1000px;
  height: 800px;
  padding: 32px 90px;
  overflow-y: auto;
`;
