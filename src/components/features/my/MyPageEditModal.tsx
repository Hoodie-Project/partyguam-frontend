import React from 'react';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { useModalContext } from '@/contexts/ModalContext';

type Props = {
  children: React.ReactNode;
  width: 'm' | 'l';
};

export default function MyPageEditModal({ children, width }: Props) {
  const { modalData, closeModal } = useModalContext();
  const { onCancel } = modalData;

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
  };
  return (
    <MyPageEditModalContainer width={width}>
      <CloseRoundedIcon
        onClick={onCancelInternal}
        sx={{
          width: '24px',
          cursor: 'pointer',
          position: 'absolute',
          right: 0,
          margin: '20px',
          zIndex: 10,
        }}
      />
      {children}
    </MyPageEditModalContainer>
  );
}
const MyPageEditModalContainer = styled.div<{ width: 'm' | 'l' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ width }) => (width === 'm' ? '430px' : '480px')};
  height: auto;
  padding: 0px 40px 48px 40px;
  background-color: white;
  border-radius: 12px;
`;
