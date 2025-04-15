'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { deleteCookie } from 'cookies-next';

import { fetchUsersLogOut } from '@/apis/auth';
import { useAuthStore } from '@/stores/auth';

import ProfileImage from '../profileImage';

export default function Dropdown() {
  const { image } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuthStore(state => ({
    logout: state.logout,
  }));

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleLogOut = async () => {
    await fetchUsersLogOut();
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    router.push('/');
    setIsOpen(false);
    logout();
  };

  return (
    <Container ref={dropdownRef}>
      <DropdownTrigger onClick={toggleDropdown}>
        <ProfileImage imageUrl={image || ''} size={32} />
        <IconWrapper>
          {isOpen ? (
            <KeyboardArrowUpRoundedIcon fontSize="medium" />
          ) : (
            <KeyboardArrowDownRoundedIcon fontSize="medium" />
          )}
        </IconWrapper>
      </DropdownTrigger>
      {isOpen && (
        <DropdownMenu>
          <MenuGroup>
            <MenuItem onClick={() => handleMenuClick('/my/profile')}>내 프로필</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/my/account')}>계정 설정</MenuItem>
          </MenuGroup>
          <Divider />
          <MenuGroup>
            <MenuItem onClick={() => handleMenuClick('/my/party')}>내 파티</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/my/apply')}>지원 목록</MenuItem>
          </MenuGroup>
          <Divider />
          <MenuGroup>
            <MenuItem onClick={() => handleLogOut()}>로그아웃</MenuItem>
          </MenuGroup>
        </DropdownMenu>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownTrigger = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 아이콘의 이벤트를 부모로 전달 */
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 130%;
  left: -50%;
  background-color: white;
  border: 1px solid #11c9a7;
  border-radius: 12px;
  padding: 8px 0;
  z-index: 1000;
  width: 105px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.04);
`;

const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  padding: 9px 20px;
  color: #111111;
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: -0.025em;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e5ec;
  margin: 8px 0px;
`;
