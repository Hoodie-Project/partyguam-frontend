'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { getCookie } from 'cookies-next';

import { Dropdown, Menus } from '@/components/_molecules';
import { ConfirmModal, LoginModal } from '@/components/features';
import { useFormContext } from '@/contexts/FormContext';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { palette, zIndex } from '@/styles';

export default function Header() {
  const router = useRouter();

  const { openModal, closeModal } = useModalContext();
  const { isFormDirty, formType } = useFormContext();

  const { isLoggedIn, login, logout } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
    login: state.login,
    logout: state.logout,
  }));

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      logout();
    } else {
      login();
    }
  }, [login, logout]);

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
          router.push('/');
          closeModal();
        },
      });
    }
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <HeaderLeft>
          <LogoButton onClick={handleClickLogo}>GUAM.</LogoButton>
          <Menus />
        </HeaderLeft>

        <HeaderRight>
          <Dropdown />
          {isLoggedIn ? (
            <></>
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
`;

const HeaderWrapper = styled.div`
  width: 77.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LogoButton = styled.button`
  font-size: 40px;
  font-weight: 900;
  background: linear-gradient(45deg, #00ffc2, #00c2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: normal;
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
  margin-left: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-self: left;
  gap: 5.9375rem;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-self: right;
`;
