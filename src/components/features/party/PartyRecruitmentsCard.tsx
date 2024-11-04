import React from 'react';
import styled from '@emotion/styled';

import { Square, Txt } from '@/components/_atoms';
import { formatDate } from '@/utils/date';

type Props = {
  createdAt: string; // 등록일
  main: string; // 메인 포지션
  sub: string; // 서브 포지션
  recruitedCount: number; // 모집된 인원
  recruitingCount: number; // 모집인원
  applicationCount: number; // 지원자
  handleClick: () => void;
};

export default function PartyRecruitmentsCard({
  createdAt,
  main,
  sub,
  recruitedCount,
  recruitingCount,
  applicationCount,
  handleClick,
}: Partial<Props>) {
  return (
    <RecruitmentCard
      onClick={handleClick}
      width="calc(50% - 8px)"
      height="155px"
      shadowKey="shadow1"
      radiusKey="base"
      backgroundColor="white"
      style={{ alignItems: 'flex-start', justifyContent: 'center', cursor: handleClick && 'pointer' }}
    >
      {createdAt && (
        <Txt fontSize={12} fontColor="grey500">
          모집일 &nbsp;{formatDate(createdAt?.toString() as string)}
        </Txt>
      )}
      <Txt fontSize={16} fontWeight="semibold" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {main} <Divider height="12px" margin="0px 8px" /> {sub}
      </Txt>
      <Info>
        {recruitedCount != null && recruitingCount != null && (
          <>
            <Txt fontSize={14} fontColor="black">
              모집중
            </Txt>
            <Txt fontSize={14} fontColor="failRed" style={{ marginRight: '20px' }}>
              {recruitedCount}/{recruitingCount}
            </Txt>
          </>
        )}
        <Txt fontSize={14} fontColor="black">
          지원자
        </Txt>
        <Txt fontSize={14} fontColor="greenDark100">
          {applicationCount}
        </Txt>
      </Info>
    </RecruitmentCard>
  );
}

const RecruitmentCard = styled(Square)`
  background-color: white;
  border: 1px solid #e5e5ec;
  padding: 16px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  gap: 4px;
`;

const Divider = styled.div<{ height?: string; margin: string }>`
  width: 2px;
  height: ${({ height }) => height};
  background-color: #d4d4d4;
  border-radius: 999px;
  margin: ${({ margin }) => margin};
`;
