import React, { useState } from 'react';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { Button, Txt } from '@/components/atoms';
import { Modal } from '@/components/molecules';

export default function LoginModal() {
  const [modalOpen, setModalOpen] = useState(true);
  return (
    <div>
      <Modal isOpen={modalOpen} position={{ top: '50%', left: '50%' }}>
        <LoginModalContainer>
          <CloseRoundedIcon
            onClick={() => {
              setModalOpen(false);
            }}
            sx={{
              width: '24px',
              cursor: 'pointer',
              position: 'absolute',
              right: 0,
              margin: '21px',
            }}
          />
          <Txt fontWeight="bold" color="--black" fontSize={20} style={{ marginTop: 35, textAlign: 'center' }}>
            로그인
          </Txt>
          <Txt fontWeight="bold" color="--black" fontSize={20} style={{ marginTop: 90 }}>
            파티괌과 함께 <br /> 파티에 참여할 준비가 되었나요?
          </Txt>
          <Txt fontWeight="normal" color="--black" fontSize={16} style={{ marginTop: 8 }}>
            소셜 로그인으로 편하게 이용해 보세요.
          </Txt>
          <Button width="l" height="s" label="카카오톡 로그인" color="yellow" shadow="none" border="none" />
          <Button width="l" height="s" label="구글 로그인" color="white" shadow="none" />
        </LoginModalContainer>
      </Modal>
    </div>
  );
}

const LoginModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 26.875rem;
  height: 34.375rem;
  transform: translate(-50%, -50%);
  background-color: var(--white);
  border-radius: 12px;
  padding: 0 48px;
`;
