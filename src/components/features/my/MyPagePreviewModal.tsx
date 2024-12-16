import React, { useMemo } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { Chip, Square, Txt } from '@/components/_atoms';
import { ProfileImage } from '@/components/_molecules';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { SFlexColumn, SFlexRow } from '@/styles/components';
import { calculateAge } from '@/utils/date';

export default function MyPagePreviewModal() {
  const { modalData, closeModal } = useModalContext();
  const { onCancel } = modalData;
  const user = useAuthStore();

  const userTime = useMemo(() => {
    // '시간'이 포함된 객체와 포함되지 않은 객체를 분리
    const timeIncluded = user.userPersonalities.filter(
      personality => personality.personalityOption.personalityQuestion.id === 1,
    );
    return timeIncluded.flatMap(personality => personality.personalityOption.content);
  }, [user]);

  const userPersonalities = useMemo(() => {
    const timeExcluded = user.userPersonalities.filter(
      personality => personality.personalityOption.personalityQuestion.id !== 1,
    );
    return timeExcluded.flatMap(personality => personality.personalityOption.content);
  }, [user]);

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
  };
  return (
    <MyPageEditModalContainer>
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
      <Square
        width="100%"
        height="auto"
        shadowKey="shadow2"
        position="flex-start"
        radiusKey="s"
        backgroundColor="white"
        style={{ display: 'flex', flexDirection: 'row', justifySelf: 'flex-start', gap: '24px', padding: '32px' }}
      >
        <ProfileImage imageUrl={user.image || ''} size={120} />
        <SFlexColumn>
          <SFlexRow style={{ alignItems: 'center' }}>
            <Txt fontWeight="semibold" fontSize={20} style={{ marginRight: '8px' }}>
              {user.nickname}
            </Txt>
            {user.genderVisible && (
              <>
                <Txt fontSize={16}>{user.gender === 'F' ? '여자' : '남자'}</Txt>
                <div
                  style={{
                    width: '2px',
                    height: '12px',
                    backgroundColor: '#999999',
                    margin: '0px 8px 0px 8px',
                    borderRadius: '12px',
                  }}
                />
              </>
            )}
            {user.birthVisible && <Txt fontSize={16}>{calculateAge(user.birth)}</Txt>}
          </SFlexRow>
          {user.userCareers.length != 0 && (
            <SFlexColumn style={{ marginTop: '12px', gap: '12px' }}>
              <SFlexRow style={{ alignItems: 'center' }}>
                <SFlexRow style={{ gap: '8px' }}>
                  {/* 년수 */}
                  <Chip
                    chipType="filled"
                    chipColor="greenLight400"
                    label={`${user.userCareers.filter(item => item.careerType === 'primary')[0]?.years}년`}
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
                          {user.userCareers.filter(item => item.careerType === 'primary')[0]?.position.main}
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
                          {user.userCareers.filter(item => item.careerType === 'primary')[0]?.position.sub}
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
                <SFlexRow style={{ gap: '8px' }}>
                  {/* 년수 */}
                  <Chip
                    chipType="filled"
                    chipColor="grey100"
                    label={`${user.userCareers.filter(item => item.careerType !== 'primary')[0]?.years}년`}
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
                    chipColor="grey100"
                    label={
                      <>
                        <Txt fontSize={16}>
                          {user.userCareers.filter(item => item.careerType !== 'primary')[0]?.position.main}
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
                          {user.userCareers.filter(item => item.careerType !== 'primary')[0]?.position.sub}
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
            </SFlexColumn>
          )}
          {user.portfolio && (
            <Link
              href={user.portfolio}
              target="_blank"
              passHref
              style={{ marginTop: '12px', color: '#0033FF', textDecoration: 'underline' }}
            >
              {user.portfolioTitle || user.portfolio}
            </Link>
          )}
        </SFlexColumn>
      </Square>

      <MyPageDetailProfileContainer>
        <SFlexRow style={{ gap: '20px' }}>
          <SFlexColumn style={{ flex: 1 }}>
            <Txt fontWeight="semibold" fontSize={18}>
              관심 지역
            </Txt>
            <SFlexRow style={{ gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {user.userLocations.map(item => (
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
          </SFlexColumn>
          <SFlexColumn style={{ flex: 1 }}>
            <Txt fontWeight="semibold" fontSize={18}>
              희망 시간
            </Txt>
            <SFlexRow style={{ gap: '8px', marginTop: '16px' }}>
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
          </SFlexColumn>
        </SFlexRow>
        <SFlexColumn>
          <Txt fontWeight="semibold" fontSize={18}>
            성향
          </Txt>
          <Personality>
            <div className="personality-container">
              {/* 왼쪽 리스트 */}
              <ul className="left-column">
                {userPersonalities.slice(0, 3).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              {/* 오른쪽 리스트 */}
              <ul className="right-column">
                {userPersonalities.slice(3).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </Personality>
        </SFlexColumn>
        <div>
          <SFlexRow>
            <Txt fontWeight="semibold" fontSize={18} style={{ marginRight: '5px' }}>
              참여 파티 목록
            </Txt>
            <Txt fontWeight="semibold" fontSize={18} fontColor="greenDark100">
              4
            </Txt>
            <Txt fontWeight="semibold" fontSize={18}>
              건
            </Txt>
          </SFlexRow>
        </div>
      </MyPageDetailProfileContainer>
    </MyPageEditModalContainer>
  );
}

const MyPageEditModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 804px;
  height: auto;
  max-height: 1053px;
  padding: 70px 102px 86px 102px;
  background-color: white;
  border-radius: 12px;
`;

const MyPageDetailProfileContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Personality = styled.div`
  margin-top: 16px;
  font-weight: normal;
  > .personality-container {
    display: flex;
    gap: 20px;
  }
  > .personality-container .left-column,
  > .personality-container .right-column {
    flex: 1;
    list-style-position: inside;
    font-size: 16px;
    line-height: 1.4;
    letter-spacing: -0.025em;
    > li {
      margin-bottom: 6px;
    }
  }
`;
