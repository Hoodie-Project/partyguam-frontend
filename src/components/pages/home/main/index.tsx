'use client';
import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { fetchGetUsers, fetchPostAccessToken } from '@/apis/auth';
import { fetchGetBanner, type HomeBanner } from '@/apis/home';
import { Txt } from '@/components/_atoms';
import { SearchBar, Select } from '@/components/_molecules';
import { HomePartyCardList, HomeRecruitmentList } from '@/components/features';
import { AccountRecoveryModal } from '@/components/features/accountRecoveryModal';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { SContainer, SHomeContainer } from '@/styles/components';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_DEV_IMAGE_URL : process.env.NEXT_PUBLIC_IMAGE_URL;

function Main() {
  const [banner, setBanner] = useState<HomeBanner | null>({
    total: 1,
    banner: [
      {
        status: '',
        createdAt: '',
        updatedAt: '',
        id: 0,
        title: '배너 예시',
        image: '',
        link: 'https://docs.google.com/forms/d/e/1FAIpQLSf3zEd7SLxEwx2VJRfp0txmY_N-xm-aA6-9nx37eAuqioM0wA/viewform?usp=header',
      },
    ],
  });
  const [page, setPage] = useState<number>(1);
  const searchOptions = [
    { id: 0, label: '파티', value: 'party' },
    { id: 1, label: '모집공고', value: 'recruitment' },
  ];
  const [searchOptionStatus, setSearchOptionStatus] = useState<{ id: number; label: string; value: string }>({
    id: 1,
    label: '모집공고',
    value: 'recruitment',
  });
  const [searchValue, setSearchValue] = useState<string>('');

  const sliderRef = useRef<Slider | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModalContext();

  const { login, setAuth } = useAuthStore();

  const { isLoggedIn } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
  }));

  const setAccessToken = async () => {
    const res = await fetchPostAccessToken();
    window.localStorage.setItem('accessToken', res.accessToken);
  };

  useEffect(() => {
    (async () => {
      await setAccessToken();
      // 홈으로 리다이렉트
      const userResponse = await fetchGetUsers();
      login();
      setAuth(userResponse);
      router.push('/home');
    })();
  }, [router]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'USER_DELETED_30D') {
      openModal({ children: <AccountRecoveryModal /> });
    }
  }, [searchParams]);

  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    arrows: false,
    infinite: false,
    centerMode: false,
    afterChange: (index: number) => setPage(index + 1),
  };

  const handleNext = () => {
    sliderRef.current?.slickNext(); // 다음 슬라이드로 이동
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev(); // 이전 슬라이드로 이동
  };

  useEffect(() => {
    const getBanner = async () => {
      const res = await fetchGetBanner();
      setBanner(res);
    };
    getBanner();
  }, []);

  // 검색 옵션 변경
  const handleSearchOptionStatusChange = (e: React.MouseEvent<HTMLLIElement>, id: number) => {
    const selectedStatus = searchOptions.find(option => option.id === id);
    if (selectedStatus) {
      setSearchOptionStatus(selectedStatus);
    }
  };

  // 닉네임 검색
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDownSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchOptionStatus.value === 'party') {
        router.push(`/home/party?search=${searchValue}`);
      } else if (searchOptionStatus.value === 'recruitment') {
        router.push(`/home/recruitment?search=${searchValue}`);
      }
    }
  };

  return (
    <SContainer>
      <SHomeContainer>
        <MainPageContentsWrapper>
          {banner && banner.total !== 0 && (
            <MainBannerSliderWrapper>
              <ControlButtons>
                <Button onClick={handlePrev}>
                  <KeyboardArrowLeftRoundedIcon />
                </Button>
                <Txt fontWeight="bold" fontSize={14} style={{ marginTop: '3px' }}>
                  {page}
                  <Txt fontWeight="bold" fontSize={14} fontColor="grey500">
                    /{banner?.total}
                  </Txt>
                </Txt>
                <Button onClick={handleNext}>
                  <KeyboardArrowRightRoundedIcon />
                </Button>
              </ControlButtons>
              <Slider ref={sliderRef} {...settings}>
                {banner?.banner.map(item => (
                  <StyledImageWrapper key={item.id}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={item.image ? `${BASE_URL}/${item.image}` : '/images/banner_example.png'}
                        width={1240}
                        height={370}
                        alt={item.title}
                        style={{ borderRadius: '16px', border: '1px solid #F1F1F5' }}
                      />
                    </a>
                  </StyledImageWrapper>
                ))}
              </Slider>
            </MainBannerSliderWrapper>
          )}
          <MainSearchWrapper>
            <div style={{ width: 'auto', minWidth: '67px' }}>
              <Select
                placeholder="검색 필터"
                options={[
                  { id: 0, label: '파티' },
                  { id: 1, label: '모집 공고' },
                ]}
                fontSize={20}
                selectStyle={{
                  width: '141px',
                  height: '60px',
                  borderRadius: '999px',
                  padding: '16px 20px',
                  whiteSpace: 'nowrap',
                }}
                optionStyle={{
                  position: 'absolute',
                  top: '66px',
                  left: 0,
                  width: '141px',
                  height: 'auto',
                  fontSize: '20px',
                  borderRadius: '24px',
                }}
                eachOptionStyle={{ padding: '14px 0px 14px 20px' }}
                value={searchOptionStatus.label}
                onClick={handleSearchOptionStatusChange}
              />
            </div>
            <div style={{ width: '1087px', height: '60px' }}>
              <SearchBar
                type="round"
                placeholder="검색어를 입력해 주세요"
                value={searchValue}
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDownSearch}
                onClear={async () => {
                  setSearchValue('');
                }}
                iconSize={28}
                searchBarStyle={{
                  padding: '16px 24px',
                }}
                searchInputStyle={{
                  fontSize: '20px',
                }}
              />
            </div>
          </MainSearchWrapper>
          {/* 맞춤형 공고 */}
          {isLoggedIn && (
            <div style={{ marginTop: '75px' }}>
              <HomeRecruitmentList personalized />
            </div>
          )}

          {/* 신규 공고 */}
          <div style={{ marginTop: isLoggedIn ? '130px' : '75px' }}>
            <HomeRecruitmentList />
            <CircleButtonWrapper>
              <CircleButton onClick={() => router.push('/home/recruitment')}>
                <Txt fontSize={14} fontColor="grey500">
                  모집공고 더보기
                </Txt>
                <KeyboardArrowRightRoundedIcon style={{ width: '20px', height: '20px', lineHeight: 0 }} />
              </CircleButton>
            </CircleButtonWrapper>
          </div>

          {/* 신규 파티 */}
          <div style={{ marginTop: '134px' }}>
            <HomePartyCardList />
            <CircleButtonWrapper style={{ marginTop: '31px' }}>
              <CircleButton onClick={() => router.push('/home/party')}>
                <Txt fontSize={14} fontColor="grey500">
                  파티 더보기
                </Txt>
                <KeyboardArrowRightRoundedIcon style={{ width: '20px', height: '20px', lineHeight: 0 }} />
              </CircleButton>
            </CircleButtonWrapper>
          </div>
        </MainPageContentsWrapper>
      </SHomeContainer>
    </SContainer>
  );
}

export default Main;

const MainPageContentsWrapper = styled.div`
  width: 100%;
  height: auto;
  padding-bottom: 92px;
`;

const MainBannerSliderWrapper = styled.div`
  position: relative;
`;

const MainSearchWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-top: 70px;
`;

const CircleButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 36px;
`;

const CircleButton = styled.button`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e5ec;
  border-radius: 999px;
  padding: 8px 16px;
  color: #999999;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
`;

const StyledImageWrapper = styled.div`
  .styled-image {
    border-radius: 16px;
    border: 1px solid #f1f1f5;
  }
`;

const ControlButtons = styled.div`
  position: absolute;
  bottom: 30px;
  right: 22px;
  width: 85px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 999px;
  z-index: 1;
  color: #767676;
  font-size: 14px;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 0 10px;
`;

const Button = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
