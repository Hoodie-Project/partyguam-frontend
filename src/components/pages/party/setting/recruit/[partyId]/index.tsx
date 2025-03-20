'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
  fetchCompletePartyRecruitmentBatchUpdate,
  fetchDeletePartyRecruitments,
  fetchGetPartyRecruitmentsList,
} from '@/apis/party';
import { Balloon, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { ConfirmModal, FloatingMenu } from '@/components/features';
import PartyRecruitSettingTable from '@/components/features/party/PartyRecruitSettingTable';
import { PARTY_SETTING_MENU } from '@/constants';
import { useModalContext } from '@/contexts/ModalContext';
import { useEditPartyRecruitForm } from '@/stores/party/useAddPartyRecruit';
import { SChildContainer, SContainer } from '@/styles/components';
import type { PartyRecruitmentListResponse } from '@/types/party';

type PageParams = {
  partyId: string;
};

function PartyRecruitSetting({ partyId }: PageParams) {
  const [status, setStatus] = useState<'active' | 'completed'>('active');
  const [partyRecruitActiveList, setPartyRecruitActiveList] = useState<PartyRecruitmentListResponse>([]);
  const [partyRecruitCompletedList, setPartyRecruitCompletedList] = useState<PartyRecruitmentListResponse>([]);

  const [isShowBalloon, setIsShowBalloon] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const isDeleteButtonActive = useMemo(() => selectedRows.length > 0, [selectedRows]);
  const { openModal, closeModal } = useModalContext();
  const { setResetEditPartyRecruitForm } = useEditPartyRecruitForm();
  const router = useRouter();

  useEffect(() => {
    // zustand store 초기화
    setResetEditPartyRecruitForm();
  }, []);

  useEffect(() => {
    const fetchActiveRecruitments = async () => {
      try {
        const requestParams = {
          partyId: parseInt(partyId),
          sort: 'createdAt',
          order: 'ASC',
          status: 'active',
        };

        const data = await fetchGetPartyRecruitmentsList(requestParams);
        setPartyRecruitActiveList(data);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
      }
    };

    const fetchCompletedRecruitments = async () => {
      try {
        const requestParams = {
          partyId: parseInt(partyId),
          sort: 'createdAt',
          order: 'ASC',
          status: 'completed',
        };

        const data = await fetchGetPartyRecruitmentsList(requestParams);
        setPartyRecruitCompletedList(data);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
      }
    };

    fetchActiveRecruitments();
    fetchCompletedRecruitments();
  }, [partyId]);

  const onClickDeleteButton = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="모집공고 삭제"
          modalContents={
            <>
              지원자에게 모집 완료 알림이 전송돼요.
              <br />
              정말로 모집을 삭제하시나요?
            </>
          }
          cancelBtnTxt="닫기"
          submitBtnTxt="삭제하기"
        />
      ),
      onCancel: () => {
        closeModal();
      },
      onSubmit: async () => {
        try {
          // 삭제 API 호출
          await fetchDeletePartyRecruitments({
            partyId: Number(partyId),
            recruitmentIds: selectedRows,
          });

          closeModal();
          window.location.reload();
          console.log('모집공고 삭제 완료');
        } catch (error) {
          console.error('모집공고 삭제 에러:', error);
        }
      },
    });
  };

  return (
    <SContainer>
      <FloatingMenu menu={PARTY_SETTING_MENU(partyId)} />
      <PageHeader
        title="모집 편집"
        titleIcon={<InfoOutlinedIcon style={{ marginLeft: '8px' }} onClick={() => setIsShowBalloon(true)} />}
        headerTooltip={
          isShowBalloon ? (
            <Balloon
              width="309px"
              onClose={() => {
                setIsShowBalloon(false);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                padding: '20px',
                transform: 'translate(42px, 0px)',
                marginTop: '20px',
                zIndex: 999,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignContent: 'flex-start',
                  justifyContent: 'flex-start',
                }}
              >
                <Txt fontSize={16} fontColor="white" fontWeight="semibold">
                  모집 최대 인원
                </Txt>
                <span style={{ marginTop: '12px' }}>
                  <Txt fontSize={14} fontColor="primaryGreen" fontWeight="semibold">
                    최대 16명
                  </Txt>
                  <Txt fontSize={14} fontColor="white" fontWeight="semibold">
                    의 파티원을 모집할 수 있어요.
                  </Txt>
                </span>
                <span>
                  <Txt fontSize={14} fontColor="white">
                    (현재 참여중인 파티장, 파티원 모두 포함한 인원){' '}
                  </Txt>
                </span>
              </div>
            </Balloon>
          ) : (
            <></>
          )
        }
      />
      <SChildContainer>
        <TitleContainer>
          <div>
            <Txt
              fontSize={20}
              fontWeight="bold"
              fontColor={status === 'active' ? 'black' : 'grey400'}
              style={{ marginTop: '50px' }}
              onClick={() => {
                setStatus('active');
              }}
            >
              진행중
            </Txt>
            <Txt
              fontSize={20}
              fontWeight="bold"
              fontColor={status === 'active' ? 'greenDark100' : 'grey400'}
              style={{ marginLeft: '8px' }}
            >
              {partyRecruitActiveList.length}
            </Txt>

            <Txt
              fontSize={20}
              fontWeight="bold"
              fontColor={status === 'completed' ? 'black' : 'grey400'}
              style={{ marginTop: '50px', marginLeft: '20px' }}
              onClick={() => {
                setStatus('completed');
              }}
            >
              모집 마감
            </Txt>
            <Txt
              fontSize={20}
              fontWeight="bold"
              fontColor={status === 'completed' ? 'greenDark100' : 'grey400'}
              style={{ marginLeft: '8px' }}
            >
              {partyRecruitCompletedList.length}
            </Txt>
          </div>
          <div>
            <AddButton onClick={() => router.push(`/party/setting/recruit/edit?type=ADD&partyId=${partyId}`)}>
              <Txt fontColor="black" fontSize={14}>
                추가하기
              </Txt>
            </AddButton>
            {status === 'active' ? (
              <DeleteButton
                isActive={isDeleteButtonActive}
                onClick={() => {
                  if (!isDeleteButtonActive) return;
                  openModal({
                    children: (
                      <ConfirmModal
                        modalTitle="모집공고 마감"
                        modalContents={
                          <>
                            지원자에게 알림이 전송돼요.
                            <br />
                            마감 후에는 수정할 수 없어요.
                            <br />
                            정말로 모집공고를 마감하시나요?
                          </>
                        }
                        cancelBtnTxt="닫기"
                        submitBtnTxt="마감하기"
                      />
                    ),
                    onCancel: () => {
                      closeModal();
                    },
                    onSubmit: async () => {
                      await fetchCompletePartyRecruitmentBatchUpdate({
                        partyId: Number(partyId),
                        partyRecruitmentIds: selectedRows,
                      });
                      closeModal();
                      window.location.reload();
                    },
                  });
                }}
              >
                <Txt fontColor={isDeleteButtonActive ? 'black' : 'grey500'} fontSize={14}>
                  마감하기
                </Txt>
              </DeleteButton>
            ) : (
              <DeleteButton
                onClick={onClickDeleteButton}
                isActive={isDeleteButtonActive}
                disabled={!isDeleteButtonActive}
              >
                <Txt fontColor={isDeleteButtonActive ? 'failRed' : 'grey500'} fontSize={14}>
                  삭제하기
                </Txt>
              </DeleteButton>
            )}
          </div>
        </TitleContainer>
        <PartyRecruitSettingTable
          status={status}
          partyId={Number(partyId)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          partyRecruitList={status === 'active' ? partyRecruitActiveList : partyRecruitCompletedList}
          setPartyRecruitList={status === 'active' ? setPartyRecruitActiveList : setPartyRecruitCompletedList}
        />
      </SChildContainer>
    </SContainer>
  );
}

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 28px;
`;

// 추가하기
const AddButton = styled.button<{ isActive?: boolean }>`
  height: 36px;
  background-color: white;
  border: 1px solid #e5e5ec;
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  margin-right: 12px;
  cursor: ${({ isActive }) => (isActive === false ? 'not-allowed' : 'pointer')};
`;

// 삭제하기
const DeleteButton = styled.button<{ isActive: boolean }>`
  height: 36px;
  background-color: white;
  border: 1px solid #e5e5ec;
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
`;

export default PartyRecruitSetting;
