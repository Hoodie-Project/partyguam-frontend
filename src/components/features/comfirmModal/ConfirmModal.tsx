'use client';
import type { HTMLAttributes } from 'react';
import React from 'react';
import styled from '@emotion/styled';

import { Txt } from '@/components/_atoms';
import { useModalContext } from '@/contexts/ModalContext';
import { palette } from '@/styles';

type OwnProps = {
  modalTitle: string;
  modalContents: React.ReactNode | string;
  cancelBtnTxt?: string;
  submitBtnTxt: string;
  handleCancel?: () => void;
  handleSubmit?: () => void;
};

export type Props = Partial<OwnProps> & Omit<HTMLAttributes<HTMLDivElement>, 'type'>;

export default function ConfirmModal({
  modalTitle,
  modalContents,
  cancelBtnTxt,
  submitBtnTxt,
  handleCancel,
  handleSubmit,
}: Props) {
  const { modalData } = useModalContext();
  const { onCancel, onSubmit } = modalData;

  return (
    <ConfirmModalContainer>
      <ModalContentsWrapper>
        <Txt fontColor="black" fontWeight="bold" fontSize={20}>
          {modalTitle}
        </Txt>
        <Txt fontColor="black" fontWeight="normal" fontSize={16} style={{ textAlign: 'center' }}>
          {modalContents}
        </Txt>
      </ModalContentsWrapper>
      <ModalButtonWrapper>
        {cancelBtnTxt != null && (
          <Button
            position="left"
            backgroundColor={palette.greenLight400}
            borderRadius="0 0 0 16px"
            onClick={handleCancel || onCancel}
          >
            <Txt fontColor="black" fontWeight="bold" fontSize={16} style={{ textAlign: 'center' }}>
              {cancelBtnTxt}
            </Txt>
          </Button>
        )}
        {submitBtnTxt != null && (
          <Button
            position="right"
            onlySubmit={cancelBtnTxt == null}
            backgroundColor={palette.primaryGreen}
            borderRadius={cancelBtnTxt ? '0 0 16px 0' : '0 0 16px 16px'}
            onClick={handleSubmit || onSubmit}
          >
            <Txt fontColor="black" fontWeight="bold" fontSize={16} style={{ textAlign: 'center' }}>
              {submitBtnTxt}
            </Txt>
          </Button>
        )}
      </ModalButtonWrapper>
    </ConfirmModalContainer>
  );
}

const ConfirmModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 25rem;
  height: 16.625rem;
  background-color: ${palette.white};
  border-radius: 16px;
`;

const ModalContentsWrapper = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 12.4769rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ModalButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 25rem;
  height: 4.1481rem;
  border-radius: 0px 0px 16px 16px;
`;

const Button = styled.div<{ position: string; backgroundColor: string; borderRadius: string; onlySubmit?: boolean }>`
  position: absolute;
  bottom: 0;
  ${({ position }) => position}: 0;
  width: ${({ onlySubmit }) => (onlySubmit ? '25rem' : '12.5rem')};
  height: 4.1481rem;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ borderRadius }) => borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
