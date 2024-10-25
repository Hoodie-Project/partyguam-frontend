'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { fetchGetPositions } from '@/apis/detailProfile';
import { fetchDelegateParty, fetchUpdatePartyUserPosition } from '@/apis/party';
import { Button, Txt } from '@/components/_atoms';
import { ProfileImage, Select } from '@/components/_molecules';
import { ConfirmModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';
import { palette } from '@/styles';
import type { Position as PositionData } from '@/types/user';

// 데이터 변환 함수
export const transformPositionData = (data: PositionData[]): { id: number; label: string }[] => {
  const uniqueMainPositions = Array.from(new Set(data.map(item => item.main)));
  return uniqueMainPositions.map((main, index) => {
    const position = data.find(item => item.main === main);
    return { id: position ? position.id : index + 1, label: main };
  });
};

// 포지션 필터링 함수
const filterPositions = (data: PositionData[], mainCategory: string): { id: number; label: string }[] => {
  return data.filter(item => item.main === mainCategory).map(item => ({ id: item.id, label: item.sub }));
};

type User = {
  id: number;
  nickname: string;
  image?: string | null;
};

type Position = {
  main: string;
  sub: string;
};

type Props = {
  partyId: number;
  user: User;
  authority: string;
  position: Position;
};

export default function PartyUserEditModal({ partyId, user, authority, position }: Props) {
  const [positionData, setPositionData] = useState<PositionData[]>([]);
  const [mainFiltered, setMainFiltered] = useState<{ id: number; label: string }[]>([]);
  const positionList = transformPositionData(positionData); // 현재는 파티장과 맴버만 존재

  const [changedAuthority, setChangedAuthority] = useState<string>(authority);
  const initialAuthority = useRef<string>(authority);

  const [changedPosition, setChangedPosition] = useState<Position & { id: number }>({ id: 0, ...position });
  const initialPosition = useRef<Position>(position);

  const { modalData, openModal, closeModal } = useModalContext();
  const { onCancel } = modalData;

  // useMemo로 상태를 반환하는 로직
  const changedStatus = useMemo(() => {
    const isAuthorityChanged = changedAuthority !== initialAuthority.current;
    const isPositionChanged =
      changedPosition.main !== initialPosition.current.main || changedPosition.sub !== initialPosition.current.sub;

    // 조건에 따른 상태 반환
    if (isAuthorityChanged && isPositionChanged) {
      return 'bothChanged'; // authority와 position 둘 다 변경됨
    } else if (isAuthorityChanged) {
      return 'authorityChanged'; // authority만 변경됨
    } else if (isPositionChanged) {
      return 'positionChanged'; // position만 변경됨
    } else {
      return 'unchanged'; // 둘 다 변경되지 않음
    }
  }, [changedAuthority, changedPosition]);

  // 포지션 데이터 가져오기
  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions();
      setPositionData(response);
    })();
  }, []);

  // main position이 변경되면 mainFiltered를 다시 계산
  useEffect(() => {
    if (changedPosition.main) {
      setMainFiltered(filterPositions(positionData, changedPosition.main));
    }
  }, [changedPosition.main, positionData]);

  // 선택 시 필드 변경 함수
  const handleSelectChange =
    (
      setter: React.Dispatch<React.SetStateAction<Position & { id: number }>>,
      field: string,
      options?: { id: number; label: string }[],
    ) =>
    (e: React.MouseEvent<HTMLLIElement>) => {
      const selectedOption =
        options && options.find(option => option.label === e.currentTarget.textContent && field === 'sub');

      setter(prev => ({
        ...prev,
        [field]: e.currentTarget.textContent || '',
        id: selectedOption ? selectedOption.id : prev.id,
        // main이 변경되면 sub를 빈 값으로 설정
        ...(field === 'main' && { sub: '' }),
      }));
    };

  // 변경 버튼 비활성화 조건
  const isDisabled변경하기 = useMemo(() => {
    const isAuthorityUnchanged = changedAuthority === initialAuthority.current;
    const isPositionUnchanged =
      changedPosition.main === initialPosition.current.main && changedPosition.sub === initialPosition.current.sub;

    const isMainChangedButSubEmpty =
      changedPosition.main !== initialPosition.current.main && changedPosition.sub === '';

    return (isAuthorityUnchanged && isPositionUnchanged) || isMainChangedButSubEmpty;
  }, [changedAuthority, changedPosition]);

  const handleClick변경하기Submit = () => {
    // 변경 사항 제출 로직
    openModal({
      children: (
        <ConfirmModal
          modalTitle={
            changedStatus === 'authorityChanged'
              ? '파티장 위임'
              : changedStatus === 'positionChanged'
                ? '파티원 수정'
                : '포지션 수정'
          }
          modalContents={
            changedStatus === 'authorityChanged' ? (
              <>
                위임 후에는 되돌릴 수 없어요.
                <br />
                정말 이 파티원에게 위임하시나요?
              </>
            ) : changedStatus === 'positionChanged' ? (
              <>해당 파티원 정보를 수정하시나요?</>
            ) : (
              <>
                파티장 위임 후에는 되돌릴 수 없어요.
                <br />
                정말로 수정하시나요?
              </>
            )
          }
          cancelBtnTxt="닫기"
          submitBtnTxt={changedStatus === 'authorityChanged' ? '위임하기' : '수정하기'}
        />
      ),
      onCancel: () => {
        closeModal();
      },
      onSubmit: async () => {
        // TODO. 파티장 권한에서 해당 로직 돌아가는지 확인
        try {
          if (changedStatus === 'authorityChanged') {
            await fetchDelegateParty({
              partyId,
              delegateUserId: user.id,
            });
          }
          if (changedStatus === 'positionChanged') {
            await fetchUpdatePartyUserPosition({
              partyId,
              partyUserId: user.id,
              positionId: changedPosition.id,
            });
          }
          if (changedStatus === 'bothChanged') {
            await fetchDelegateParty({
              partyId,
              delegateUserId: user.id,
            });
            await fetchUpdatePartyUserPosition({
              partyId,
              partyUserId: user.id,
              positionId: changedPosition.id,
            });
          }
        } catch (error) {
          console.error('파티원 정보 수정 에러:', error);
        } finally {
          closeModal();
          openModal({
            children: (
              <ConfirmModal
                modalTitle="파티원 수정 완료"
                modalContents="해당 파티원의 포지션이 수정되었어요"
                submitBtnTxt="닫기"
              />
            ),
            onSubmit: () => {
              closeModal();
            },
          });
        }
      },
    });
  };

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
  };

  return (
    <PartyUserEditModalContainer>
      <CloseRoundedIcon
        onClick={onCancelInternal}
        sx={{
          width: '24px',
          cursor: 'pointer',
          position: 'absolute',
          right: 0,
          margin: '21px',
        }}
      />
      <Txt fontWeight="bold" fontSize={20} style={{ marginTop: 40, textAlign: 'center' }}>
        수정하기
      </Txt>
      <Txt fontWeight="semibold" fontSize={18} style={{ marginTop: 40 }}>
        포지션/직책 변경 대상 멤버
      </Txt>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '8px',
          marginTop: '16px',
        }}
      >
        <ProfileImage imageUrl={user.image || ''} size={40} authority="member" />
        <Txt
          fontWeight="normal"
          fontSize={14}
          style={{
            textAlign: 'start',
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {user.nickname}
        </Txt>
      </div>
      <Txt fontWeight="semibold" fontSize={18} style={{ marginTop: 40 }}>
        변경할 포지션
      </Txt>
      <FlexWrapper>
        <Select
          placeholder="직군"
          options={positionList}
          value={changedPosition.main}
          onClick={handleSelectChange(setChangedPosition, 'main')}
        />
        <Select
          placeholder="직무"
          options={mainFiltered}
          value={changedPosition.sub}
          onClick={handleSelectChange(setChangedPosition, 'sub', mainFiltered)}
        />
      </FlexWrapper>

      <Txt fontWeight="semibold" fontSize={18} style={{ marginTop: 40 }}>
        변경할 직책
      </Txt>
      <FlexWrapper>
        <Button
          onClick={e => {
            e.preventDefault();
            setChangedAuthority('master');
          }}
          width="ms"
          height="l"
          backgroudColor={changedAuthority === 'master' ? 'greenLight200' : 'white'}
          borderColor={changedAuthority === 'master' ? 'transparent' : 'grey200'}
          radius="base"
          shadow="shadow1"
        >
          <Txt fontColor="black">파티장</Txt>
        </Button>
        <Button
          onClick={e => {
            e.preventDefault();
            setChangedAuthority('member');
          }}
          width="ms"
          height="l"
          backgroudColor={changedAuthority === 'member' ? 'greenLight200' : 'white'}
          borderColor={changedAuthority === 'member' ? 'transparent' : 'grey200'}
          radius="base"
          shadow="shadow1"
          disabled={authority === 'master'}
        >
          <Txt fontColor="black">파티원</Txt>
        </Button>
      </FlexWrapper>

      <Button
        style={{ width: '100%', marginTop: '60px' }}
        disabled={isDisabled변경하기}
        backgroudColor="primaryGreen"
        radius="base"
        shadow="shadow1"
        onClick={handleClick변경하기Submit}
        height="l"
      >
        <Txt fontWeight="bold" fontColor={isDisabled변경하기 ? 'grey400' : 'black'}>
          변경하기
        </Txt>
      </Button>
    </PartyUserEditModalContainer>
  );
}

const PartyUserEditModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 26.875rem;
  height: 657px;
  background-color: ${palette.white};
  border-radius: 12px;
  padding: 0 40px;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-top: 16px;
`;
