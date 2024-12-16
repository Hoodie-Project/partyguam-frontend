import React from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { Txt } from '@/components/_atoms';
import { Tabs } from '@/components/_molecules';
import { SelectPersonality } from '@/components/features/detailProfile';
import MyPageEditModal from '@/components/features/my/MyPageEditModal';
import { useModalContext } from '@/contexts/ModalContext';

type Props = {
  userPersonalities?: string[];
};

export default function MyPersonalitySection({ userPersonalities }: Props) {
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();

  const handleClickOpenPersonalityModal = () => {
    router.replace('/my/profile?num=4');

    openModal({
      children: (
        <MyPageEditModal width="l">
          <Tabs defaultIndex={0} style={{ marginTop: '30px' }}>
            <Tabs.TabList borderNone>
              <Tabs.Tab index={0} width="60px" handleClick={() => router.replace('/my/profile?num=4')}>
                <Txt fontSize={16} fontWeight="bold">
                  1/3 단계
                </Txt>
              </Tabs.Tab>
              <Tabs.Tab index={1} width="60px" handleClick={() => router.replace('/my/profile?num=5')}>
                <Txt fontSize={16} fontWeight="bold">
                  2/3 단계
                </Txt>
              </Tabs.Tab>
              <Tabs.Tab index={2} width="60px" handleClick={() => router.replace('/my/profile?num=6')}>
                <Txt fontSize={16} fontWeight="bold">
                  3/3 단계
                </Txt>
              </Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
          <SelectPersonality editType="others" />
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
        <ul>{userPersonalities?.map((item, i) => <li key={i}>{item}</li>)}</ul>
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
