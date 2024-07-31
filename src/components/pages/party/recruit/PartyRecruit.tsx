'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { fetchGetPositions } from '@/apis/detailProfile';
import { fetchPostRecruitmentParty } from '@/apis/party';
import { Button, Txt } from '@/components/_atoms';
import { PageHeader, Select } from '@/components/_molecules';
import { ConfirmModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';
import type { Position } from '@/types/user';

// TODO. 데이터 정제 로직 걷어내고 query로 api 보내도록 변경 필요
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

const 인원수 = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, label: (i + 1).toString() }));

function PartyRecruit() {
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();

  const [selected모집인원, setSelected모집인원] = useState([
    {
      positionId: 0,
      직군: '',
      직무: '',
      recruiting_count: '',
    },
  ]);

  const [positionData, setPositionData] = useState<Position[]>([]);
  const positionList = useMemo(() => transformPositionData(positionData), [positionData]);

  const positionFiltered = useMemo(
    () =>
      selected모집인원.map(item => {
        if (item.직군) {
          return filterPositions(positionData, item.직군);
        }
        return [{ id: 0, label: '' }];
      }),
    [positionData, selected모집인원],
  );

  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions();
      setPositionData(response);
    })();
  }, []);

  const handleSelectChange =
    (index: number, field: string, options?: { id: number; label: string }[]) =>
    (e: React.MouseEvent<HTMLLIElement>) => {
      const selectedOption = options?.find(option => option.label === e.currentTarget.textContent);

      setSelected모집인원(prev => {
        const newSelected = [...prev];
        newSelected[index] = {
          ...newSelected[index],
          positionId: field === '직무' ? selectedOption?.id || 0 : newSelected[index].positionId,
          [field]: e.currentTarget.textContent || '',
        };
        return newSelected;
      });
    };

  const handleAddPosition = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelected모집인원(prev => [...prev, { positionId: 0, 직군: '', 직무: '', recruiting_count: '' }]);
  };

  const handleRemovePosition = (index: number) => {
    setSelected모집인원(prev => prev.filter((_, i) => i !== index));
  };

  const isAllFieldsFilled = useCallback(
    (item: (typeof selected모집인원)[0]) => {
      return item.직군 && item.직무 && item.recruiting_count;
    },
    [selected모집인원],
  );

  const isButtonDisabled = useMemo(() => {
    return !selected모집인원.every(isAllFieldsFilled);
  }, [isAllFieldsFilled, selected모집인원]);

  const onClickCancel = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="나가기"
          modalContents={
            <>
              파티 모집이 완료되지 않았어요.
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

  const onClickApply = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="등록 완료"
          modalContents={<div style={{}}>모집공고가 등록되었어요!</div>}
          submitBtnTxt="닫기"
        />
      ),
      onCancel: () => {
        router.push('/');
        closeModal();
      },
      // TODO. 파티 페이지로 이동해야함 -> 기획 이후
      onSubmit: () => {
        router.push('/');
        closeModal();
      },
    });
  };

  const handleSubmitButton = async () => {
    try {
      const transformBodyData = selected모집인원.map(item => ({
        positionId: item.positionId,
        recruiting_count: parseInt(item.recruiting_count, 10),
      }));
      console.log(transformBodyData);
      const res = await fetchPostRecruitmentParty({ partyId: 7, data: { recruitments: transformBodyData } });
      console.log('[POST 파티원 모집 등록]', res);
      onClickApply();
    } catch (e) {
      console.error('[Error 파티원 모집 등록]', e);
    }
  };

  return (
    <SContainer>
      <PageHeader title="파티원 모집" />
      <PartyRecruitContainer>
        <SFlexColumnFull>
          <SMargin margin="3.125rem 0rem 0rem 0rem" />
          <Txt fontSize={20} fontWeight="bold">
            모집 인원
          </Txt>
          <SMargin margin="0rem 0rem .25rem 0rem" />
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            포지션과 인원을 입력해 주세요.
          </Txt>
          <SFlexColumnFull style={{ gap: 20 }}>
            {selected모집인원.map((item, i) => (
              <SFlexRowFull
                key={i}
                style={{ position: 'relative', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
              >
                <Select
                  placeholder="직군"
                  height="l"
                  options={positionList}
                  value={selected모집인원[i].직군}
                  onClick={handleSelectChange(i, '직군', positionList)}
                />
                <Select
                  placeholder="직무"
                  height="l"
                  options={positionFiltered[i]}
                  value={selected모집인원[i].직무}
                  onClick={handleSelectChange(i, '직무', positionFiltered[i])}
                />
                <Select
                  placeholder="인원수"
                  height="l"
                  options={인원수}
                  value={selected모집인원[i].recruiting_count}
                  onClick={handleSelectChange(i, 'recruiting_count', 인원수)}
                />
                {isAllFieldsFilled(item) && (
                  <CloseRoundedIcon
                    onClick={() => handleRemovePosition(i)}
                    sx={{
                      position: 'absolute',
                      right: '-5%',
                      width: '30px',
                      cursor: 'pointer',
                      fill: 'black',
                    }}
                  />
                )}
              </SFlexRowFull>
            ))}
          </SFlexColumnFull>
          <AddButton onClick={e => handleAddPosition(e)}>+</AddButton>
          <SMargin margin="1.25rem 0rem 0rem 0rem" />
        </SFlexColumnFull>
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
            height="l"
            width="base"
            backgroudColor="primaryGreen"
            radius="base"
            shadow="shadow1"
            disabled={isButtonDisabled}
            onClick={handleSubmitButton}
          >
            <Txt fontWeight="bold" fontColor={isButtonDisabled ? 'grey400' : 'black'}>
              모집하기
            </Txt>
          </Button>
        </SFlexRowFull>
      </PartyRecruitContainer>
    </SContainer>
  );
}

export default PartyRecruit;

const PartyRecruitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 820px;
  height: auto;
  margin-top: calc(50px + 56px);
`;

const AddButton = styled.button`
  width: 100%;
  height: 3.5rem;
  background-color: white;
  border: 1px solid #e5e5ec;
  border-radius: 16px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  margin-top: 20px;
`;
