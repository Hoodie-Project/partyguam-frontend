import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { Txt } from '@/components/_atoms';
import MyPageEditModal from '@/components/features/my/MyPageEditModal';
import MySelectPersonality from '@/components/features/my/MySelectPersonality';
import { useModalContext } from '@/contexts/ModalContext';
import type { UserPersonality } from '@/types/user';

type Props = {
  userPersonalities?: UserPersonality[];
};

export default function MyPersonalitySection({ userPersonalities }: Props) {
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();

  const timeExcluded = useMemo(
    () =>
      userPersonalities
        ?.filter(personality => personality.personalityOption.personalityQuestion.id !== 1)
        .flatMap(personality => personality.personalityOption.content),
    [userPersonalities],
  );

  const handleClickOpenPersonalityModal = () => {
    router.replace('/my/profile?num=4');

    openModal({
      children: (
        <MyPageEditModal width="l">
          <MySelectPersonality />
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
          성향
        </Txt>
        <KeyboardArrowRightRoundedIcon
          onClick={handleClickOpenPersonalityModal}
          style={{ cursor: 'pointer', width: '24px', height: '24px', color: '#767676' }}
        />
      </DetailProfilTitleWrapper>
      <Personality>
        <ul>{timeExcluded?.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </Personality>
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

const Personality = styled.div`
  margin-top: 20px;
  font-weight: normal;
  > ul {
    line-height: 1.4;
    letter-spacing: -0.025em;
    list-style-position: inside;
    font-size: 16px;
    > li {
      margin-bottom: 6px;
    }
  }
`;
