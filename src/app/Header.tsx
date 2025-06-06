'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { getCookie } from 'cookies-next';

import { fetchPostAccessToken } from '@/apis/auth';
import { fetchGetNotificationsCheck } from '@/apis/notifications';
import NotificationsNewIcon from '@/assets/icon/notification-new.svg';
import NotificationsNoneIcon from '@/assets/icon/notification-none.svg';
import { Dropdown, Menus } from '@/components/_molecules';
import { ConfirmModal, LoginModal } from '@/components/features';
import NotificationModal from '@/components/features/notificationModal';
import { useFormContext } from '@/contexts/FormContext';
import { useModalContext } from '@/contexts/ModalContext';
import { useNotificationModal } from '@/hooks/useNotificationModal';
import { useAuthStore } from '@/stores/auth';
import { palette, zIndex } from '@/styles';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [hasNewNotification, setHasNewNotification] = useState(false);

  const { openModal, closeModal } = useModalContext();
  const { isFormDirty, formType } = useFormContext();
  const {
    isNotificationModalOpen,
    handleOpenNotificationModal,
    handleCloseNotificationModal,
    notificationFilter,
    setNotificationFilter,
    notificationData,
    fetchMoreRef,
  } = useNotificationModal();

  const { isLoggedIn, login, logout } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
    login: state.login,
    logout: state.logout,
  }));

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const res = await fetchGetNotificationsCheck();
        setHasNewNotification(res.hasUnchecked);
      } catch (err) {
        console.error('알림 상태 확인 실패', err);
      }
    };

    if (isLoggedIn) {
      fetchNotificationStatus();
    }
  }, [pathname, isLoggedIn]);

  const setAccessToken = async () => {
    const res = await fetchPostAccessToken();
    window.localStorage.setItem('accessToken', res.accessToken);
  };

  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (!isLoggedIn && !accessToken && refreshToken) {
      setAccessToken();
      login();
    }
  }, [login, isLoggedIn]);

  const handleClickLogo = () => {
    if (isFormDirty) {
      openModal({
        children: (
          <>
            {formType == '필수회원가입' && (
              <ConfirmModal
                modalTitle="나가기"
                modalContents={
                  <>
                    회원가입이 완료되지 않았습니다.
                    <br />
                    나가시겠습니까?
                  </>
                }
                cancelBtnTxt="취소"
                submitBtnTxt="나가기"
              />
            )}
            {formType == '세부프로필작성' && (
              <ConfirmModal
                modalTitle="나가기"
                modalContents={
                  <>
                    입력한 내용들이 모두 초기화됩니다.
                    <br />
                    나가시겠습니까?
                  </>
                }
                cancelBtnTxt="취소"
                submitBtnTxt="나가기"
              />
            )}
          </>
        ),
        onCancel: () => {
          closeModal();
        },
        onSubmit: () => {
          router.push('/landing');
          closeModal();
        },
      });
    } else {
      router.push('/landing');
    }
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <HeaderLeft>
          <LogoButton onClick={handleClickLogo}>
            <Image src="/images/logo/logo2_primary.png" alt="파티구함로고" width={134.48} height={50} />
          </LogoButton>
          <Menus />
        </HeaderLeft>

        <HeaderRight>
          {isLoggedIn && <CircleButton onClick={() => router.push('/party/create')}>파티 생성하기 +</CircleButton>}
          {isLoggedIn &&
            (hasNewNotification ? (
              <NotificationsNewIcon
                onClick={handleOpenNotificationModal}
                style={{ width: '28px', height: '28px', marginRight: '20px', cursor: 'pointer' }}
              />
            ) : (
              <NotificationsNoneIcon
                onClick={handleOpenNotificationModal}
                style={{ width: '28px', height: '28px', marginRight: '20px', cursor: 'pointer' }}
              />
            ))}
          {isNotificationModalOpen && (
            <NotificationModal
              notificationData={notificationData}
              onClose={handleCloseNotificationModal}
              filter={notificationFilter}
              setFilter={setNotificationFilter}
              fetchMoreRef={fetchMoreRef}
            />
          )}
          {isLoggedIn ? (
            <Dropdown />
          ) : (
            <LoginButton onClick={() => openModal({ children: <LoginModal /> })}>로그인</LoginButton>
          )}
        </HeaderRight>
      </HeaderWrapper>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 84px;
  width: 100%;
  border-bottom: 2px solid;
  border-color: ${palette.grey200};
  z-index: ${zIndex.navIndex};
  background-color: ${palette.white};

  @media (max-width: 673px) {
    display: none;
  }
`;

const HeaderWrapper = styled.div`
  width: 77.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LogoButton = styled.button`
  background-color: transparent;
`;

/** NOTE
 * Chip과는 별개로 로그인 버튼
 */
const LoginButton = styled.button`
  display: inline-flex;
  align-items: center;
  border-radius: 62.4375rem;
  background-color: ${palette.primaryGreen};
  height: 2.25rem;
  font-size: 1.25rem;
  padding: 0.25rem 1.25rem 0.25rem 1.25rem;
  color: ${palette.black};
  cursor: pointer;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-self: left;
  gap: 5.9375rem;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-self: right;
  align-items: center;
`;

const CircleButton = styled.button`
  background-color: #21ecc7;
  border-radius: 999px;
  padding: 7px 12px;
  color: #000000;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: -0.025em;
  margin-right: 24px;
`;
