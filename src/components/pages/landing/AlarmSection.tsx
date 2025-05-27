import React from 'react';
import styled from '@emotion/styled';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

import { fetchPostUsersAppOpen } from '@/apis/auth';
import { Txt } from '@/components/_atoms';
import { ConfirmModal, LoginModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';

export default function AlarmSection() {
  const { openModal, closeModal } = useModalContext();
  const { isLoggedIn } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
  }));

  const handleClick = async () => {
    const result = await fetchPostUsersAppOpen();

    if (!isLoggedIn) {
      openModal({ children: <LoginModal /> });
    }

    switch (result?.status) {
      case 201:
        openModal({
          children: (
            <ConfirmModal
              modalTitle="알림 신청 완료"
              modalContents={
                <>
                  곧 파티 구함 앱 서비스
                  <br />
                  오픈 소식을 메일로 받아보실 수 있어요!
                </>
              }
              submitBtnTxt="닫기"
            />
          ),
          onSubmit: () => {
            closeModal();
          },
        });
        break;
      case 409:
        openModal({
          children: (
            <ConfirmModal
              modalTitle="알림 중복 신청"
              modalContents={
                <>
                  이미 파티 구함 앱 서비스
                  <br />
                  오픈 소식 알림을 신청했어요!
                </>
              }
              submitBtnTxt="닫기"
            />
          ),
          onSubmit: () => {
            closeModal();
          },
        });
        break;
      case 401:
        openModal({ children: <LoginModal /> });
        break;
      default:
        <> </>;
    }
  };
  return (
    <SectionContainer>
      <Header>
        <Txt fontWeight="bold" fontSize={60} style={{ lineHeight: '140%' }}>
          프로젝트의 시작은 Party Guham 과 함께!
        </Txt>
        <Txt fontWeight="normal" fontSize={24} style={{ lineHeight: '140%', marginTop: '24px' }}>
          파티구함 앱 서비스 오픈 전에
          <br />
          메일로 미리 알림을 받을 수 있어요!
        </Txt>
      </Header>
      <NotiButton onClick={() => handleClick()}>
        <NotificationsNoneRoundedIcon style={{ width: '30px', height: '30px', marginRight: '8px' }} />앱 서비스 오픈
        알림 받기
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
