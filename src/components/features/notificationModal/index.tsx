import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { fetchDeleteNotification, fetchPatchReadNotification, type NotificationType } from '@/apis/notifications';
import KebabMenu from '@/assets/icon/kebab-menu.svg';
import { Chip, Txt } from '@/components/_atoms';
import { DropdownV2 } from '@/components/_molecules/dropdown';
import { SFlexColumn, SFlexRow, SFlexRowCenter } from '@/styles/components';
import { formatRelativeTime } from '@/utils/date';

type Props = {
  notificationData: NotificationType[];
  onClose: () => void;
  filter: 'all' | 'party' | 'recruit';
  setFilter: React.Dispatch<React.SetStateAction<'all' | 'party' | 'recruit'>>;
  fetchMoreRef: React.RefObject<any> | ((node?: Element | null) => void);
};

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_DEV_IMAGE_URL : process.env.NEXT_PUBLIC_IMAGE_URL;

export default function NotificationModal({ notificationData, onClose, filter, setFilter, fetchMoreRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [kebabSettingOpenId, setKebabSettingOpenId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleClickNotiBox = async (notiId: number, notiLink: string) => {
    await fetchPatchReadNotification(notiId);
    router.push(`${isDev ? 'https://localhost:3000' : 'https://partyguham.com'}${notiLink}`);
    onClose();
  };

  const handleClickKebab = (id: number) => {
    setKebabSettingOpenId(id);
  };

  return (
    <Container ref={containerRef}>
      <ModalContainer>
        <Wrapper>
          <ModalHeader>
            <CloseRoundedIcon
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fill: 'black',
                zIndex: 10,
              }}
            />

            <SFlexRowCenter style={{ width: '100%', height: '80px', padding: '26px' }}>
              <Txt fontSize={20} fontWeight="bold">
                알림
              </Txt>
            </SFlexRowCenter>

            <SFlexRow style={{ width: '100%', marginTop: '24px', marginBottom: '20px', padding: '0 20px', gap: '7px' }}>
              {[
                { label: ' 전체 ', value: 'all' },
                { label: '파티 활동', value: 'party' },
                { label: '지원 소식', value: 'recruit' },
              ].map((item, i) => (
                <Chip
                  key={i}
                  chipType="outlined"
                  label={item.label}
                  size="small"
                  chipColor={filter === item.value ? '#21ECC7' : '#E5E5EC'}
                  fontColor={filter === item.value ? 'black' : '#767676'}
                  fontWeight={filter === item.value ? 'bold' : 'normal'}
                  onClick={() => setFilter(item.value as 'all' | 'party' | 'recruit')}
                />
              ))}
            </SFlexRow>

            <NotiText>최근 14일 동안의 알림만 확인 가능합니다.</NotiText>
          </ModalHeader>
          <NotificationWrapper>
            {notificationData.length === 0 && (
              <EmptyState>
                <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
                <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
                  새로운 알림이 없어요.
                </Txt>
              </EmptyState>
            )}
            {notificationData.map(item => {
              return (
                <NotificationBox
                  key={item.id}
                  isRead={item.isRead}
                  onClick={() => handleClickNotiBox(item.id, item.link)}
                >
                  <Header>
                    <SFlexColumn style={{ alignItems: 'center', gap: '4px' }}>
                      <ImageWrapper isRead={item.isRead}>
                        {/* {item.image == null ? (
                          <Avatar name="sacagawea" variant="beam" size={48} colors={['#7ff4df', '#00c2ff']} />
                        ) : ( */}
                        <Image
                          alt="알림이미지"
                          src={item.image == null ? '/images/default-party-light200.jpg' : `${BASE_URL}/${item.image}`}
                          width={48}
                          height={48}
                          style={{ borderRadius: '99px' }}
                        />
                        {/* )} */}
                      </ImageWrapper>
                      <SFlexRow>
                        <Txt fontSize={12} fontWeight="semibold" fontColor={item.isRead ? 'grey500' : 'black'}>
                          {item.notificationType.label}
                        </Txt>
                        {!item.isRead && <Dot />}
                      </SFlexRow>
                    </SFlexColumn>
                    <KebabMenu
                      onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                        e.stopPropagation();
                        handleClickKebab(item.id);
                      }}
                      style={{ position: 'absolute', top: '20px', right: '20px' }}
                    />
                    {item.id === kebabSettingOpenId && (
                      <DropdownV2
                        menuItemstyle={{ color: '#DC0000', textAlign: 'center' }}
                        dropDownStyle={{ width: '99px' }}
                        isVisible={true}
                        menuList={[
                          {
                            label: '삭제',
                            onClick: async () => {
                              await fetchDeleteNotification(item.id);
                            },
                          },
                        ]}
                        positionStyle={{ position: 'absolute', top: '50px', right: '18px' }}
                      />
                    )}
                  </Header>
                  <SFlexColumn style={{ width: '100%' }}>
                    <Body>
                      <Txt
                        fontSize={16}
                        fontWeight="semibold"
                        fontColor={item.isRead ? 'grey500' : 'black'}
                        style={{
                          width: '268px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </Txt>
                      <Txt
                        fontSize={16}
                        fontColor={item.isRead ? 'grey500' : 'black'}
                        style={{
                          width: '316px',
                          maxHeight: '66px',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.4',
                        }}
                      >
                        {item.message}
                      </Txt>
                    </Body>

                    <Footer>
                      <Txt fontSize={14} fontColor={formatRelativeTime(item.createdAt).color}>
                        {formatRelativeTime(item.createdAt).label}
                      </Txt>
                    </Footer>
                  </SFlexColumn>
                </NotificationBox>
              );
            })}
            <div ref={fetchMoreRef} />
          </NotificationWrapper>
        </Wrapper>
      </ModalContainer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 50px;
  right: -60px;
  width: 490px;
  height: 640px;
  z-index: 999;
  border-radius: 16px;
  border: 1px solid #d4d4d4;
  box-shadow: 0px 2px 10px -1px rgba(17, 17, 17, 0.16);
  background-color: white;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  position: relative;
`;

const ModalHeader = styled.header`
  position: sticky;
  background-color: white;
  top: 0;
  z-index: 10;
`;

const NotiText = styled.div`
  width: 100%;
  padding: 8px 20px;
  color: #767676;
  background-color: #f1f1f5;
  font-size: 14px;
`;

const NotificationWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationBox = styled.div<{ isRead: boolean }>`
  position: relative;
  width: 440px;
  height: 144px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid ${({ isRead }) => (isRead ? '#e5e5ec' : '#21ECC7')};
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  padding: 20px 24px;
  display: flex;
  flex-direction: row;
  gap: 22px;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #21ecc7;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  align-items: flex-end;
`;
const ImageWrapper = styled.div<{ isRead: boolean }>`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: ${({ isRead }) => (isRead ? 0.7 : 0)};
    z-index: 1;
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 0;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #767676;
  margin-top: 76px;
`;
