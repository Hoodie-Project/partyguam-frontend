import React from 'react';
import styled from '@emotion/styled';

import { Square, Txt } from '@/components/_atoms';
import { SFlexColumnFull, SMargin } from '@/styles/components';

type Props = {
  partyIntro?: string;
};

function PartyHomeTab({ partyIntro }: Props) {
  return (
    <PartyHomeTabContainer>
      <SMargin margin="35px 0px 0px 0px" />
      <SFlexColumnFull>
        <Txt fontSize={20} fontWeight="bold">
          파티 소개
        </Txt>
        <SMargin margin="20px 0px 0px 0px" />
        <Square
          width="100%"
          height="fit-content"
          shadowKey="shadow1"
          backgroundColor="white"
          borderColor="grey200"
          radiusKey="base"
          position="flex-start"
          style={{ padding: '28px' }}
        >
          <Txt fontSize={16}>{partyIntro}</Txt>
        </Square>
      </SFlexColumnFull>
    </PartyHomeTabContainer>
  );
}

export default PartyHomeTab;

const PartyHomeTabContainer = styled.section`
  height: 100%;
`;
