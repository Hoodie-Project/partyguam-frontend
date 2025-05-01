import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { fetchPostUsersRecover } from '@/apis/auth';
import { Button, Txt } from '@/components/_atoms';
import { useModalContext } from '@/contexts/ModalContext';
import { palette } from '@/styles';
import { SFlexRow } from '@/styles/components';
import { formatDate } from '@/utils/date';

export default function AccountRecoveryModal() {
  const { modalData, closeModal } = useModalContext();
  const { onCancel } = modalData;
  const searchParams = useSearchParams();
  const router = useRouter();

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
    router.replace('/');
  };

  return (
    <AccountRecoveryContainer>
      <CloseRoundedIcon
        onClick={onCancelInternal}
        sx={{
          width: '24px',
          cursor: 'pointer',
          position: 'absolute',
          right: 0,
          margin: '20px',
        }}
      />
      <Txt fontWeight="bold" fontSize={20} style={{ marginTop: '40px', textAlign: 'center', lineHeight: '140%' }}>
        계정 복구 안내
      </Txt>
      <Txt fontWeight="bold" fontSize={22} style={{ marginTop: '60px' }}>
        최근 탈퇴한 계정이 있습니다.
      </Txt>
      <Txt fontWeight="normal" fontSize={18} style={{ marginTop: '20px' }}>
        탈퇴 후 <b>30일 동안</b> 정보가 보관되며, 해당 기간 내 정보를 복구할 수 있어요.
      </Txt>
      <Txt fontWeight="normal" fontSize={18} style={{ marginTop: '12px' }}>
        복구를 원하시면, <b style={{ color: '#11C9A7' }}>계정 복구</b> 버튼을 눌러주세요!
      </Txt>
      <InnerTxtBox>
        <SFlexRow style={{ gap: '8px' }}>
          <Txt fontWeight="semibold" fontSize={16}>
            이메일
          </Txt>
          <Txt>{searchParams.get('email') != null ? searchParams.get('email') : 'null'}</Txt>
        </SFlexRow>
        <SFlexRow style={{ gap: '8px' }}>
          <Txt fontWeight="semibold" fontSize={16}>
            탈퇴일
          </Txt>
          <Txt>
            {searchParams.get('deletedAt') != null ? formatDate(searchParams.get('deletedAt') as string) : 'null'}
          </Txt>
        </SFlexRow>
      </InnerTxtBox>
      <SFlexRow>
        <InfoOutlinedIcon style={{ width: '20px', height: '20px', marginRight: '6px', color: '#999999' }} />
        <Txt fontSize={16}>계정을 복구하면 기존 데이터와 설정이 그대로 유지됩니다.</Txt>
      </SFlexRow>
      <SFlexRow style={{ marginTop: '12px' }}>
        <InfoOutlinedIcon style={{ width: '20px', height: '20px', marginRight: '6px', color: '#999999' }} />
        <Txt fontSize={16}>30일이 경과하면 계정이 영구 삭제되며, 이후에는 복구가 불가능합니다.</Txt>
      </SFlexRow>
      <Button
        onClick={async e => {
          e.preventDefault();
          await fetchPostUsersRecover();
          onCancel?.();
          closeModal();
          router.replace('/');
        }}
        shadow="shadow2"
        style={{ width: '100%', height: '56px', marginTop: '100px', cursor: 'pointer' }}
      >
        <Txt fontSize={16} fontWeight="bold">
          계정 복구
        </Txt>
      </Button>
    </AccountRecoveryContainer>
  );
}

const AccountRecoveryContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 480px;
  height: auto;
  background-color: ${palette.white};
  border-radius: 12px;
  padding: 0 48px 48px;
`;

const InnerTxtBox = styled.div`
  padding: 24px 20px;
  border: 1px solid #e5e5ec;
  border-radius: 16px;
  margin-top: 32px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
