'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { fetchDeletePartyRecruitments } from '@/apis/party';
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
  const [partyRecruitList, setPartyRecruitList] = useState<PartyRecruitmentListResponse>([]);

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
          console.log('모집공고 삭제 완료');
        } catch (error) {
          console.error('모집공고 삭제 에러:', error);
        } finally {
          closeModal();
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
                <span>
                  <Txt fontSize={16} fontColor="primaryGreen" fontWeight="semibold">
                    모집 최대 인원
                  </Txt>
                  <Txt fontSize={16} fontColor="white" fontWeight="semibold">
                    에 대해 알려드릴게요
                  </Txt>
                </span>
                <span>
                  <Txt fontSize={14} fontColor="white">
                    파티원을 포함해
                  </Txt>
                  <Txt fontSize={14} fontColor="primaryGreen">
                    16명
                  </Txt>
                  <Txt fontSize={14} fontColor="white">
                    의 파티원을 모집할 수 있어요
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
            <Txt fontSize={20} fontWeight="bold" style={{ marginTop: '50px' }}>
              모집 공고
            </Txt>
            <Txt fontSize={20} fontWeight="bold" fontColor="greenDark100" style={{ marginLeft: '8px' }}>
              {partyRecruitList.length}
            </Txt>
          </div>
          <div>
            <AddButton onClick={() => router.push(`/party/setting/recruit/edit?type=ADD&partyId=${partyId}`)}>
              <Txt fontColor="primaryGreen" fontSize={14} fontWeight="semibold">
                추가하기
              </Txt>
            </AddButton>
            <DeleteButton
              onClick={onClickDeleteButton}
              isActive={isDeleteButtonActive}
              disabled={!isDeleteButtonActive}
            >
              <Txt fontColor={isDeleteButtonActive ? 'failRed' : 'grey500'} fontSize={14} fontWeight="semibold">
                삭제하기
              </Txt>
            </DeleteButton>
          </div>
        </TitleContainer>
        <PartyRecruitSettingTable
          partyId={Number(partyId)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          partyRecruitList={partyRecruitList}
          setPartyRecruitList={setPartyRecruitList}
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
const AddButton = styled.button`
  background-color: white;
  border: 1px solid #21ecc7;
  border-radius: 999px;
  padding: 8px 26px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  margin-right: 12px;
`;

// 삭제하기
const DeleteButton = styled.button<{ isActive: boolean }>`
  background-color: white;
  border: ${({ isActive }) => (isActive ? '1px solid #DC0000' : '1px solid #e5e5ec')};
  border-radius: 999px;
  padding: 8px 26px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
`;

export default PartyRecruitSetting;
