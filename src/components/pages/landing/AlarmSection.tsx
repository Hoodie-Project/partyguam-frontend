import React from 'react';
import styled from '@emotion/styled';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

import { Txt } from '@/components/_atoms';

export default function AlarmSection() {
  return (
    <SectionContainer>
      <Header>
        <Txt fontWeight="bold" fontSize={60} style={{ lineHeight: '140%' }}>
          프로젝트의 시작은 Party Guham 과 함꼐!
        </Txt>
        <Txt fontWeight="normal" fontSize={24} style={{ lineHeight: '140%', marginTop: '24px' }}>
          파티구함 서비스 오픈 전에
          <br />
          메일로 미리 알림을 받을 수 있어요!
        </Txt>
      </Header>
      <NotiButton>
        <NotificationsNoneRoundedIcon style={{ width: '30px', height: '30px', marginRight: '8px' }} />
        서비스 오픈 알림 받기
      </NotiButton>
    </SectionContainer>
  );
}
const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 701px;
  background: linear-gradient(180deg, #ffffff 0%, #c5faf0 100%);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 219px;
  margin-bottom: 114px;
`;

const NotiButton = styled.button`
  width: 270px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: #21ecc7;
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
`;
