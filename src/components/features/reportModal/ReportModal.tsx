'use client';
import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { fetchPostReports } from '@/apis/report';
import { Button, Input, Txt } from '@/components/_atoms';
import { useModalContext } from '@/contexts/ModalContext';
import { palette } from '@/styles';

import ConfirmModal from '../comfirmModal';

type Props = {
  reportType: string;
  reportTypeId: number;
};

export default function ReportModal({ reportType, reportTypeId }: Props) {
  const [reportInputValue, setReportInputValue] = useState<string>('');
  const { modalData, openModal, closeModal } = useModalContext();
  const { onCancel } = modalData;

  const reportInputState = useMemo(() => {
    if (reportInputValue.length > 250) return 'warn';
    if (reportInputValue.length > 0 && reportInputValue.length <= 250) return 'success';
    return 'default';
  }, [reportInputValue]);

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
  };

  const handleClickSubmitReport = async () => {
    if (reportInputState !== 'success') return;

    try {
      await fetchPostReports({
        type: reportType,
        typeId: reportTypeId,
        content: reportInputValue,
      });

      closeModal();
      openModal({
        children: (
          <ConfirmModal
            modalTitle="신고 접수"
            modalContents={
              <>
                신고가 접수되었어요.
                <br />
                검토하고 빠르게 조취를 취할게요.
              </>
            }
            submitBtnTxt="확인"
          />
        ),
        onSubmit: () => {
          closeModal();
        },
      });
    } catch (error) {
      console.error('신고 제출 중 오류 발생:', error);
      alert('신고 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <ReportModalContainer>
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
        신고
      </Txt>
      <Txt fontWeight="normal" fontSize={16} style={{ textAlign: 'center', margin: '15px 0px' }}>
        신고 사유를 작성해 주세요.
      </Txt>
      <Input.TextArea
        height="320px"
        maxCount={250}
        inputState={reportInputState}
        onChange={e => {
          setReportInputValue(e.target.value);
        }}
        onClear={() => {
          setReportInputValue('');
        }}
        value={reportInputValue}
        placeholder="신고 내용은 검토 후에 처리돼요.
            &#13;&#10;허위 신고 시 이용에 제한 될 수 있어요."
        clearAll={false}
      />
      <Button
        style={{ width: '100%', marginTop: '10px' }}
        disabled={reportInputState != 'success'}
        backgroudColor="primaryGreen"
        radius="base"
        shadow="shadow1"
        onClick={handleClickSubmitReport}
        height="l"
      >
        <Txt fontWeight="bold" fontColor={reportInputState != 'success' ? 'grey400' : 'black'}>
          신고하기
        </Txt>
      </Button>
    </ReportModalContainer>
  );
}

const ReportModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 26.875rem;
  height: 34.375rem;
  background-color: ${palette.white};
  border-radius: 12px;
  padding: 0 40px;
`;
