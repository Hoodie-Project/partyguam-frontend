'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { fetchUserAuthority } from '@/apis/auth';
import { fetchBatchDeletePartyUsers, fetchGetPositions, fetchPartyAdminUsers } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { PageHeader, SearchBar, Select } from '@/components/_molecules';
import { ConfirmModal, FloatingMenu } from '@/components/features';
import { PartyUsersManageTable } from '@/components/features/party';
import { PARTY_SETTING_MENU } from '@/constants';
import { useModalContext } from '@/contexts/ModalContext';
import { useEditPartyRecruitForm } from '@/stores/party/useAddPartyRecruit';
import { SChildContainer, SContainer } from '@/styles/components';
import type { PartyUserListByAdminResponse, Position } from '@/types/party';

// 직군 필터링 함수
const filterMainCategories = (data: Position[]): { id: number; label: string }[] => {
  const uniqueMain = Array.from(new Set(data.map(item => item.main)));
  const mainOptions = uniqueMain.map((main, index) => ({
    id: index + 1,
    label: main,
  }));

  // '전체' 항목을 첫 번째로 추가
  return [{ id: 0, label: '전체' }, ...mainOptions];
};

type PageParams = {
  partyId: string;
};

function PartyUsersManage({ partyId }: PageParams) {
  const [partyUserList, setPartyUserList] = useState<PartyUserListByAdminResponse | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [mainFiltered, setMainFiltered] = useState<{ id: number; label: string }[]>([]); // 직군 리스트 받아서 저장
  const [mainPositionSearch, setMainPositionSearch] = useState<{ id: number; label: string }>({ id: 0, label: '전체' }); // 선택한 직군 리스트
  const [nicknameSearch, setNicknameSearch] = useState<string>('');

  const isDeleteButtonActive = useMemo(() => selectedRows.length > 0, [selectedRows]);
  const { openModal, closeModal } = useModalContext();
  const { setResetEditPartyRecruitForm } = useEditPartyRecruitForm();
  const router = useRouter();

  // 관리자 아니면 party 홈으로 이동
  useEffect(() => {
    (async () => {
      const res = await fetchUserAuthority(Number(partyId));
      if (res?.authority !== 'master') {
        router.replace(`/party/${partyId}`);
      }
    })();
  });

  useEffect(() => {
    const fetchPartyUsers = async () => {
      try {
        const requestParams = {
          partyId: Number(partyId),
          sort: 'createdAt',
          order,
          main: mainPositionSearch.label || '',
        };

        const data = await fetchPartyAdminUsers(requestParams);
        setPartyUserList(data);
      } catch (err) {
        console.error('Error fetching partyUsers : ', err);
      }
    };
    fetchPartyUsers();
  }, [partyId, order, mainPositionSearch]);

  useEffect(() => {
    // zustand store 초기화
    setResetEditPartyRecruitForm();
  }, []);

  // 직군 데이터 가져오기
  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions();
      setMainFiltered(filterMainCategories(response));
    })();
  }, []);

  // 직군 선택 핸들러 수정
  const handleSelectChange =
    (setter: React.Dispatch<React.SetStateAction<{ id: number; label: string }>>, field: string) =>
    (e: React.MouseEvent<HTMLLIElement>) => {
      const selectedText = e.currentTarget?.textContent || '';
      if (selectedText) {
        setter(prev => ({
          ...prev,
          [field]: selectedText,
        }));
      }
    };

  // 닉네임 검색
  const handleChangeNicknameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameSearch(e.target.value);
  };

  const handleKeyDownNicknameSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // search 포함 fetch
      try {
        const requestParams = {
          partyId: Number(partyId),
          sort: 'createdAt',
          order,
          main: mainPositionSearch.label || '',
          nickname: nicknameSearch,
        };

        const data = await fetchPartyAdminUsers(requestParams);
        setPartyUserList(data);
      } catch (err) {
        console.error('Error fetching partyUsers : ', err);
      }
    }
  };

  const onClick내보내기Button = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="내보내기"
          modalContents={
            <>
              내보내기 후에는 되돌릴 수 없어요. <br />
              정말로 이 파티원을 내보내시나요?
            </>
          }
          cancelBtnTxt="닫기"
          submitBtnTxt="내보내기"
        />
      ),
      onCancel: () => {
        closeModal();
      },
      onSubmit: async () => {
        try {
          // 삭제 API 호출
          await fetchBatchDeletePartyUsers({
            partyId: Number(partyId),
            partyUserIds: selectedRows,
          });
          console.log('파티원 다수 내보내기 완료');
        } catch (error) {
          console.error('파티원 다수 내보내기 에러:', error);
        } finally {
          closeModal();
        }
      },
    });
  };

  return (
    <SContainer>
      <FloatingMenu menu={PARTY_SETTING_MENU(partyId)} />
      <PageHeader title="파티원 관리" />
      <SChildContainer style={{ height: '100vh' }}>
        <TitleContainer>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 'auto' }}>
            <Txt fontSize={20} fontWeight="bold">
              파티원
            </Txt>
            <div style={{ width: 'auto', display: 'flex', flexDirection: 'row', flexShrink: 0 }}>
              <Txt fontSize={20} fontWeight="bold" fontColor="greenDark100" style={{ marginLeft: '8px' }}>
                {partyUserList?.total}
              </Txt>
              <Txt fontSize={16} fontWeight="bold" fontColor="grey500" style={{ marginLeft: '2px' }}>
                / {partyUserList?.totalPartyUserCount}
              </Txt>
            </div>
            <Select
              height="xs"
              selectRadius="xs"
              optionRadius="xs"
              placeholder="직군 선택"
              fontSize={14}
              options={mainFiltered}
              value={mainPositionSearch.label}
              onClick={handleSelectChange(setMainPositionSearch, 'label')}
              selectStyle={{
                minWidth: '67px',
                width: 'auto',
                padding: '8px 12px',
                flexShrink: 0,
                marginLeft: '20px',
              }}
              optionStyle={{ width: '170px', left: '0', border: '1px solid #11C9A7' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 'auto' }}>
            <div style={{ width: '240px', height: '36px' }}>
              <SearchBar
                type="line"
                placeholder="닉네임을 검색해 보세요."
                value={nicknameSearch}
                onChange={handleChangeNicknameSearch}
                onKeyDown={handleKeyDownNicknameSearch}
                onClear={async () => {
                  setNicknameSearch('');
                  try {
                    const requestParams = {
                      partyId: Number(partyId),
                      sort: 'createdAt',
                      order,
                      main: mainPositionSearch.label || '',
                      nickname: '',
                    };

                    const data = await fetchPartyAdminUsers(requestParams);
                    setPartyUserList(data);
                  } catch (err) {
                    console.error('Error fetching partyUsers : ', err);
                  }
                }}
              />
            </div>
            <DeleteButton
              onClick={onClick내보내기Button}
              isActive={isDeleteButtonActive}
              disabled={!isDeleteButtonActive}
            >
              <Txt fontColor={isDeleteButtonActive ? 'failRed' : 'grey500'} fontSize={14} fontWeight="semibold">
                내보내기
              </Txt>
            </DeleteButton>
          </div>
        </TitleContainer>
        <PartyUsersManageTable
          partyId={Number(partyId)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          order={order}
          setOrder={setOrder}
          partyUserList={partyUserList}
        />
      </SChildContainer>
    </SContainer>
  );
}

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  margin-top: 50px;
`;

// 삭제하기
const DeleteButton = styled.button<{ isActive: boolean }>`
  background-color: white;
  border: ${({ isActive }) => (isActive ? '1px solid #DC0000' : '1px solid #e5e5ec')};
  border-radius: 999px;
  padding: 8px 26px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  margin-left: 20px;
`;

export default PartyUsersManage;
