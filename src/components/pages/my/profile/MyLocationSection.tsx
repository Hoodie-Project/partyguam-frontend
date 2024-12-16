import React from 'react';
import styled from '@emotion/styled';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { Chip, Txt } from '@/components/_atoms';
import { SelectLocation } from '@/components/features/detailProfile';
import MyPageEditModal from '@/components/features/my/MyPageEditModal';
import { useModalContext } from '@/contexts/ModalContext';
import { SFlexRow } from '@/styles/components';
import type { UserLocation } from '@/types/user';

type Props = {
  userLocations: UserLocation[];
};

export default function MyLocationSection({ userLocations }: Props) {
  const { openModal, closeModal } = useModalContext();
  const handleClickOpenLocationModal = () => {
    openModal({
      children: (
        <MyPageEditModal width="l">
          <SelectLocation editMode={true} />
        </MyPageEditModal>
      ),
      onCancel: () => closeModal(),
      onSubmit: () => {},
    });
  };

  return (
    <div>
      <DetailProfilTitleWrapper>
        <Txt fontWeight="semibold" fontSize={18}>
          관심 지역
        </Txt>
        <KeyboardArrowRightRoundedIcon
          onClick={handleClickOpenLocationModal}
          style={{ cursor: 'pointer', width: '24px', height: '24px', color: '#767676' }}
        />
      </DetailProfilTitleWrapper>
      <SFlexRow style={{ gap: '8px', marginTop: '20px' }}>
        {userLocations.map(item => (
          <Chip
            key={item.id}
            chipType="filled"
            chipColor="greenLight400"
            label={`${item.location.province} ${item.location.city}`}
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
