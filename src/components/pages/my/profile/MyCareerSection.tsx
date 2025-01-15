import styled from '@emotion/styled';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { Chip, Txt } from '@/components/_atoms';
import { SelectPosition } from '@/components/features/detailProfile';
import MyPageEditModal from '@/components/features/my/MyPageEditModal';
import { useModalContext } from '@/contexts/ModalContext';
import { SFlexColumn, SFlexRow } from '@/styles/components';
import type { UserCareer } from '@/types/user';

type Props = {
  userCareers: UserCareer[];
};

export default function MyCareerSection({ userCareers }: Props) {
  const { openModal, closeModal } = useModalContext();
  const handleClickOpenCareerModal = () => {
    openModal({
      children: (
        <MyPageEditModal width="m">
          <SelectPosition editMode={true} />
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
          경력/포지션
        </Txt>
        <KeyboardArrowRightRoundedIcon
          onClick={handleClickOpenCareerModal}
          style={{ width: '24px', height: '24px', color: '#767676', cursor: 'pointer' }}
        />
      </DetailProfilTitleWrapper>
      {userCareers.length != 0 && (
        <SFlexColumn style={{ marginTop: '20px' }}>
          <SFlexRow style={{ alignItems: 'center' }}>
            <Txt fontWeight="semibold" fontSize={16} style={{ marginRight: '24px' }}>
              주포지션
            </Txt>
            <SFlexRow style={{ gap: '8px' }}>
              {/* 년수 */}
              <Chip
                chipType="filled"
                chipColor="greenLight400"
                label={
                  userCareers.filter(item => item.careerType === 'primary')[0]?.years === 0
                    ? '신입'
                    : `${userCareers.filter(item => item.careerType === 'primary')[0]?.years}년`
                }
                chipStyle={{
                  fontSize: '16px',
                  width: 'auto',
                  height: '24px',
                  padding: '4px 10px',
                  boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                  cursor: 'initial',
                }}
              />
              {/* 주포지션 */}
              <Chip
                chipType="filled"
                chipColor="greenLight400"
                label={
                  <>
                    <Txt fontSize={16}>
                      {userCareers.filter(item => item.careerType === 'primary')[0]?.position.main}
                    </Txt>
                    <div
                      style={{
                        width: '2px',
                        height: '12px',
                        backgroundColor: '#7FF4DF',
                        margin: '0px 6px 0px 6px',
                        borderRadius: '12px',
                      }}
                    />
                    <Txt fontSize={16}>
                      {userCareers.filter(item => item.careerType === 'primary')[0]?.position.sub}
                    </Txt>
                  </>
                }
                chipStyle={{
                  width: 'auto',
                  height: '24px',
                  padding: '4px 10px',
                  boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                  cursor: 'initial',
                }}
              />
            </SFlexRow>
          </SFlexRow>
          <SFlexRow style={{ alignItems: 'center' }}>
            <Txt fontWeight="semibold" fontSize={16} style={{ marginRight: '24px' }}>
              부포지션
            </Txt>
            {userCareers.filter(item => item.careerType !== 'primary')[0]?.position.main && (
              <SFlexRow style={{ gap: '8px' }}>
                {/* 년수 */}
                <Chip
                  chipType="filled"
                  chipColor="grey100"
                  label={
                    userCareers.filter(item => item.careerType !== 'primary')[0]?.years === 0
                      ? '신입'
                      : `${userCareers.filter(item => item.careerType !== 'primary')[0]?.years}년`
                  }
                  chipStyle={{
                    fontSize: '16px',
                    width: 'auto',
                    height: '24px',
                    padding: '4px 10px',
                    boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                    cursor: 'initial',
                  }}
                />
                {/* 부포지션 */}
                <Chip
                  chipType="filled"
                  chipColor="grey100"
                  label={
                    <>
                      <Txt fontSize={16}>
                        {userCareers.filter(item => item.careerType !== 'primary')[0]?.position.main}
                      </Txt>
                      <div
                        style={{
                          width: '2px',
                          height: '12px',
                          backgroundColor: '#999999',
                          margin: '0px 6px 0px 6px',
                          borderRadius: '12px',
                        }}
                      />
                      <Txt fontSize={16}>
                        {userCareers.filter(item => item.careerType !== 'primary')[0]?.position.sub}
                      </Txt>
                    </>
                  }
                  chipStyle={{
                    width: 'auto',
                    height: '24px',
                    padding: '4px 10px',
                    boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                    cursor: 'initial',
                  }}
                />
              </SFlexRow>
            )}
          </SFlexRow>
        </SFlexColumn>
      )}
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
