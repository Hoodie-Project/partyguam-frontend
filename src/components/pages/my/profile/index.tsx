'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { fetchGetUsers, fetchPatchUsers } from '@/apis/auth';
import { fetchGetUsersMeParties } from '@/apis/detailProfile';
import { Button, Square, Txt } from '@/components/_atoms';
import { PageHeader, ProfileImage, Toggle } from '@/components/_molecules';
import { FloatingMenu } from '@/components/features';
import MyPagePreviewModal from '@/components/features/my/MyPagePreviewModal';
import { MYPAGE_MENU } from '@/constants';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { SContainer, SFlexRow, SFlexRowCenter, SFlexRowFull, SFlexRowJustifyBetween } from '@/styles/components';
import { calculateAge } from '@/utils/date';
import { svgSizeMap } from '@/utils/svg';

import MyCareerSection from './MyCareerSection';
import MyLocationSection from './MyLocationSection';
import MyPersonalitySection from './MyPersonalitySection';
import { MyTimeSection } from './MyTimeSection';

function MyProfile() {
  const { login, setAuth } = useAuthStore();
  const user = useAuthStore();
  const [userImage, setUserImage] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState({ gender: user.genderVisible, birth: user.birthVisible });
  const [portfolio, setPortFolio] = useState({
    portfolio: user.portfolio ?? '',
    portfolioTitle: user.portfolioTitle ?? '',
  });
  const [참여중파티수, set참여중파티수] = useState<number | undefined>(0);

  const router = useRouter();
  const { openModal, closeModal } = useModalContext();

  useEffect(() => {
    (async () => {
      const userResponse = await fetchGetUsers();
      setAuth(userResponse);
    })();
  }, [router]);

  const portfolioInputValid = useMemo(() => {
    const { portfolio: portfolioLink, portfolioTitle } = portfolio;

    // 0. 초기 상태: portfolioLink portfolioTitle이 모두 null일 때 -> 'INITIAL'
    if ((portfolioLink || '').trim() === '' && (portfolioTitle || '').trim() === '') {
      return 'INITIAL';
    }

    // 1. portfolioLink 또는 portfolioTitle 중 하나라도 null이 아닐 때 -> 'VALID'
    if ((portfolioLink || '').trim() !== '') {
      return 'VALID';
    }

    if ((portfolioTitle || '').trim() !== '') {
      // 2. portfolioTitle이 null이 아니면서 16자 미만일 때 -> 'VALID'
      if (portfolioTitle?.length < 16) {
        return 'VALID';
      } else return 'INVALID';
    }

    return 'INITIAL';
  }, [portfolio]);

  const 수정완료disabled = useMemo(() => {
    // 초기 상태와 비교하여 값이 변경되었는지 확인
    if (user.birthVisible !== isVisible.birth) return false; // 변경되었다면 활성화
    if (user.genderVisible !== isVisible.gender) return false; // 변경되었다면 활성화
    if (userImage != null) return false;

    // portfolio와 portfolioTitle의 null과 ''를 동일하게 처리
    if ((user.portfolio || '').trim() !== (portfolio.portfolio || '').trim()) return false; // 변경되었다면 활성화
    if ((user.portfolioTitle || '').trim() !== (portfolio.portfolioTitle || '').trim()) return false; // 변경되었다면 활성화

    // portfolio와 portfolioTitle이 초기 상태(null)였고 현재도 비어 있다면 비활성화
    if ((user.portfolio == null || user.portfolio.trim() === '') && portfolio.portfolio?.trim() === '') return true;
    if ((user.portfolioTitle == null || user.portfolioTitle.trim() === '') && portfolio.portfolioTitle?.trim() === '')
      return true;

    return true; // 기본적으로 비활성화 상태 유지
  }, [
    isVisible.birth,
    isVisible.gender,
    portfolio.portfolio,
    portfolio.portfolioTitle,
    user.birthVisible,
    user.genderVisible,
    user.portfolio,
    user.portfolioTitle,
    userImage,
  ]);

  useEffect(() => {
    (async () => {
      const userResponse = await fetchGetUsers();
      login();
      setAuth(userResponse);

      // 상태 동기화
      setIsVisible({
        gender: userResponse.genderVisible,
        birth: userResponse.birthVisible,
      });

      setPortFolio({
        portfolio: userResponse.portfolio,
        portfolioTitle: userResponse.portfolioTitle,
      });
      const 참여중파티 = await fetchGetUsersMeParties({ page: 1, limit: 5, sort: 'createdAt', order: 'ASC' });
      set참여중파티수(참여중파티?.total);
    })();
  }, [login, setAuth, router]);

  const handleGenderToggle = () => {
    setIsVisible(prev => {
      const updatedState = { ...prev, gender: !prev.gender };
      return updatedState;
    });
  };

  const handleBirthToggle = () => {
    setIsVisible(prev => {
      const updatedState = { ...prev, birth: !prev.birth };
      return updatedState;
    });
  };

  const handleSubmitPatchUser = async () => {
    try {
      const formData = new FormData();
      if (userImage) {
        formData.append('image', userImage);
      }
      formData.append('gender', user.gender);
      formData.append('genderVisible', isVisible.gender ? 'true' : 'false');
      formData.append('birth', user.birth);
      formData.append('birthVisible', isVisible.birth ? 'true' : 'false');
      formData.append('portfolioTitle', portfolio.portfolioTitle);
      formData.append('portfolio', portfolio.portfolio);

      await fetchPatchUsers(formData);
      window.location.reload();
    } catch (error) {
      console.error('handleSubmitPatchUser : ', error);
    }
  };

  const handleOpenPreviewModal = () => {
    openModal({
      children: <MyPagePreviewModal />,
    });
  };
  return (
    <SContainer>
      <FloatingMenu menu={MYPAGE_MENU()} />

      <PageHeader title="프로필 편집" />
      <MyProfileContainer>
        {/* 프로필 */}
        <Square
          width="100%"
          height="auto"
          shadowKey="shadow2"
          radiusKey="s"
          backgroundColor="white"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 0px 23px 0px' }}
        >
          <ProfileImage imageUrl={user.image || ''} setImage={setUserImage} size={100} editMode />
          <Txt fontWeight="semibold" fontSize={18}>
            {user.nickname}
          </Txt>
          <SFlexRowJustifyBetween style={{ gap: '60px' }}>
            <SFlexRowCenter style={{ gap: isVisible.gender ? '25px' : '19px' }}>
              <Txt fontWeight="normal" fontSize={16}>
                {user.gender === 'F' ? '여자' : '남자'}
              </Txt>
              <Toggle isOn={isVisible.gender} labelOn="공개" labelOff="비공개" onToggle={handleGenderToggle} />
            </SFlexRowCenter>
            <SFlexRowCenter style={{ gap: isVisible.birth ? '25px' : '19px' }}>
              <Txt fontWeight="normal" fontSize={16}>
                {calculateAge(user.birth)}살
              </Txt>
              <Toggle isOn={isVisible.birth} labelOn="공개" labelOff="비공개" onToggle={handleBirthToggle} />
            </SFlexRowCenter>
          </SFlexRowJustifyBetween>
        </Square>
        <DetailProfileContainer>
          {/* 세부 프로필 - 경력/포지션*/}
          <MyCareerSection userCareers={user.userCareers} />

          {/* 세부 프로필 - 관심 지역*/}
          <MyLocationSection userLocations={user.userLocations} />

          {/* 세부 프로필 - 희망 시간*/}
          <MyTimeSection userTime={user.userPersonalities} />

          {/* 세부 프로필 - 성향*/}
          <MyPersonalitySection userPersonalities={user.userPersonalities} />

          {/* 세부 프로필 - 이력서 및 포트폴리오 링크*/}
          <div>
            <Txt fontWeight="semibold" fontSize={18}>
              이력서 및 포트폴리오 링크
            </Txt>
            <PortfolioInputContainer inputState={portfolioInputValid}>
              <SFlexRow>
                <Input
                  type="url"
                  placeholder="링크를 입력해 주세요."
                  value={portfolio.portfolio}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPortFolio(prev => {
                      const updatedState = { ...prev, portfolio: event.target.value };
                      return updatedState;
                    })
                  }
                />
                {portfolio.portfolio && (
                  <CancelOutlinedIcon
                    onClick={() => {
                      setPortFolio(prev => {
                        const updatedState = { ...prev, portfolio: '' };
                        return updatedState;
                      });
                    }}
                    sx={{
                      width: `${svgSizeMap['s'].size}`,
                      strokeWidth: `${svgSizeMap['s'].strokeWidth}`,
                      cursor: 'pointer',
                    }}
                  />
                )}
              </SFlexRow>
              <Divider />
              <SFlexRow style={{ alignItems: 'center' }}>
                <Input
                  type="text"
                  placeholder="링크 제목을 입력해 주세요. (최대 15글자)"
                  value={portfolio.portfolioTitle}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPortFolio(prev => {
                      const updatedState = { ...prev, portfolioTitle: event.target.value };
                      return updatedState;
                    })
                  }
                />
                {portfolio.portfolioTitle && (
                  <Txt
                    fontWeight="normal"
                    fontColor="grey400"
                    fontSize={14}
                    style={{ display: 'inline-block', width: '60px', marginLeft: '16px', lineHeight: '0%' }}
                  >
                    {portfolio.portfolioTitle?.length} / 15
                  </Txt>
                )}
                {portfolio.portfolioTitle && (
                  <CancelOutlinedIcon
                    onClick={() => {
                      setPortFolio(prev => {
                        const updatedState = { ...prev, portfolioTitle: '' };
                        return updatedState;
                      });
                    }}
                    sx={{
                      width: `${svgSizeMap['s'].size}`,
                      strokeWidth: `${svgSizeMap['s'].strokeWidth}`,
                      cursor: 'pointer',
                    }}
                  />
                )}
              </SFlexRow>
            </PortfolioInputContainer>
            {portfolioInputValid === 'INVALID' && (
              <WarnMessage inputState={portfolioInputValid}>15자 이내로 입력해 주세요</WarnMessage>
            )}
          </div>

          {/* 세부 프로필 - 참여 파티 목록*/}
          <div>
            <SFlexRow>
              <Txt fontWeight="semibold" fontSize={18} style={{ marginRight: '5px' }}>
                참여 파티 목록
              </Txt>
              <Txt fontWeight="semibold" fontSize={18} fontColor="greenDark100">
                {참여중파티수}
              </Txt>
              <Txt fontWeight="semibold" fontSize={18}>
                건
              </Txt>
            </SFlexRow>
          </div>
        </DetailProfileContainer>
        <SFlexRowFull style={{ gap: '8px', marginTop: '120px' }}>
          <Button
            backgroudColor="white"
            borderColor="primaryGreen"
            height="l"
            shadow="shadow1"
            onClick={handleOpenPreviewModal}
            style={{ width: '196px' }}
          >
            <Txt fontWeight="bold" fontSize={18}>
              미리 보기
            </Txt>
          </Button>
          <Button
            height="l"
            shadow="shadow2"
            onClick={() => handleSubmitPatchUser()}
            disabled={수정완료disabled || portfolioInputValid === 'INVALID'}
            style={{ width: '196px' }}
          >
            <Txt
              fontWeight="bold"
              fontSize={18}
              fontColor={수정완료disabled || portfolioInputValid === 'INVALID' ? 'grey400' : 'black'}
            >
              수정 완료
            </Txt>
          </Button>
        </SFlexRowFull>
      </MyProfileContainer>
    </SContainer>
  );
}

export default MyProfile;

const MyProfileContainer = styled.div`
  width: 400px;
  height: 100%;
  margin-top: 112px;
  margin-bottom: 58px;
`;

const DetailProfileContainer = styled.section`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const PortfolioInputContainer = styled.div<{ inputState: 'INITIAL' | 'VALID' | 'INVALID' }>`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  padding: 20px;
  border: 1px solid;
  border-color: ${({ inputState }) =>
    inputState === 'INITIAL' ? '#E5E5EC' : inputState === 'INVALID' ? '#DC0000' : '#21ECC7'};
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  margin-top: 20px;
`;

const Input = styled.input`
  width: 100%;
  height: 24px;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333333;
  background-color: transparent;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
  }
`;

const WarnMessage = styled.div<{ inputState?: 'INITIAL' | 'VALID' | 'INVALID' }>`
  color: ${({ inputState }) => inputState === 'INVALID' && '#DC0000'};
  margin: ${props => (props.inputState ? '8px 0 0 20px' : '0px')};
  font-size: 14px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e5e5ec;
  margin: 15px 0px;
`;
