import React from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { Chip, Txt } from '@/components/_atoms';
import { SelectPersonality } from '@/components/features/detailProfile';
import MyPageEditModal from '@/components/features/my/MyPageEditModal';
import { useModalContext } from '@/contexts/ModalContext';
import { SFlexRow } from '@/styles/components';

type Props = {
  userTime?: string[];
};

export function MyTimeSection({ userTime }: Props) {
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();
  const handleClickOpenTimeModal = () => {
    router.replace('/my/profile?num=3');
    openModal({
      children: (
        <MyPageEditModal width="l">
          <SelectPersonality editType="time" />
        </MyPageEditModal>
      ),
      onCancel: () => {
        router.replace('/my/profile');
        closeModal();
      },
      onSubmit: () => {},
    });
  };
  return (
    <div>
      <DetailProfilTitleWrapper>
        <Txt fontWeight="semibold" fontSize={18}>
          희망 시간
        </Txt>
        <KeyboardArrowRightRoundedIcon
          onClick={handleClickOpenTimeModal}
          style={{ cursor: 'pointer', width: '24px', height: '24px', color: '#767676' }}
        />
      </DetailProfilTitleWrapper>
      <SFlexRow style={{ gap: '8px', marginTop: '20px' }}>
        {userTime?.map((item, i) => (
          <Chip
            key={i}
            chipType="filled"
            chipColor="greenLight400"
            label={item}
            chipStyle={{
              fontSize: '16px',
              width: 'auto',
              height: '24px',
              padding: '4px 10px',
              boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
              cursor: 'initial',
            }}
          />
        ))}
      </SFlexRow>
    </div>
  );
}

const DetailProfilTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
