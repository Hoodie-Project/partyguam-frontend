'use client';
import React from 'react';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import GoogleIcon from '@/assets/icon/google-icon.svg';
import KakaoIcon from '@/assets/icon/kakao-icon.svg';
import { Button, Txt } from '@/components/atoms';
import { useModalContext } from '@/contexts/ModalContext';
import { palette } from '@/styles';

export default function LoginModal() {
  const { modalData, closeModal } = useModalContext();
  const { onCancel } = modalData;

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
  };
  return (
    <LoginModalContainer>
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
      <Txt fontWeight="bold" fontSize={20} style={{ marginTop: 35, textAlign: 'center' }}>
        로그인
      </Txt>
      <Txt fontWeight="bold" fontSize={20} style={{ marginTop: 90 }}>
        파티괌과 함께 <br /> 파티에 참여할 준비가 되었나요?
      </Txt>
      <Txt fontWeight="normal" fontSize={16} style={{ marginTop: 8 }}>
        소셜 로그인으로 편하게 이용해 보세요.
      </Txt>
      <LoginButtonContainer>
        <Button
          width="l"
          height="s"
          backgroudColor="kakaoBtn"
          shadow="none"
          borderColor="transparent"
          style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingLeft: '32px' }}
        >
          <KakaoIcon />
          <Txt fontSize={14} fontWeight="bold" style={{ marginLeft: '12px' }}>
            카카오톡 로그인
          </Txt>
        </Button>
        <Button
          width="l"
          height="s"
          backgroudColor="white"
          shadow="none"
          borderColor="grey200"
          style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingLeft: '32px' }}
        >
          <GoogleIcon />
          <Txt fontSize={14} fontWeight="bold" style={{ marginLeft: '12px' }}>
            구글 로그인
          </Txt>
        </Button>
      </LoginButtonContainer>
      <BottomText>
        <Txt fontSize={12} style={{ whiteSpace: 'nowrap' }}>
          소셜 로그인 가입 시&nbsp;
        </Txt>
        <Txt fontSize={12} style={{ whiteSpace: 'nowrap', textDecoration: 'underline' }}>
          이용약관&nbsp;
        </Txt>
        <Txt fontSize={12} style={{ whiteSpace: 'nowrap', textDecoration: 'underline' }}>
          개인정보처리방침&nbsp;
        </Txt>
        <Txt fontSize={12} style={{ whiteSpace: 'nowrap', textDecoration: 'underline' }}>
          전자금융거래약관&nbsp;
        </Txt>
        <Txt fontSize={12} style={{ whiteSpace: 'nowrap', textDecoration: 'underline' }}>
          결제/환불약관
        </Txt>
        <Txt fontSize={12} style={{ whiteSpace: 'nowrap' }}>
          에 동의한 것으로 간주합니다.
        </Txt>
      </BottomText>
      <Txt fontSize={12} fontColor="grey500" style={{ marginBottom: '41px', textAlign: 'center' }}>
        문의하기
      </Txt>
    </LoginModalContainer>
  );
}

const LoginModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 26.875rem;
  height: 34.375rem;
  background-color: ${palette.white};
  border-radius: 12px;
  padding: 0 48px;
`;

const LoginButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 56px;
  margin-bottom: 22px;
`;

const BottomText = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
`;
