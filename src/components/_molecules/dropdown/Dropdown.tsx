'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

import { useAuthStore } from '@/stores/auth';

import ProfileImage from '../profileImage';

export default function Dropdown() {
  const { image } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <Container>
      <DropdownTrigger onClick={toggleDropdown}>
        <ProfileImage imageUrl={image || ''} size={32} />
        {isOpen ? <KeyboardArrowUpRoundedIcon fontSize="medium" /> : <KeyboardArrowDownRoundedIcon fontSize="medium" />}
      </DropdownTrigger>
      {isOpen && (
        <DropdownMenu>
          <MenuGroup>
            <MenuItem onClick={() => router.push('/my/profile')}>내 프로필</MenuItem>
            <MenuItem onClick={() => router.push('/my/account')}>계정 설정</MenuItem>
          </MenuGroup>
          <Divider />
          <MenuGroup>
            <MenuItem>내 파티</MenuItem>
            <MenuItem>지원 목록</MenuItem>
          </MenuGroup>
          <Divider />
          <MenuGroup>
            <MenuItem>로그아웃</MenuItem>
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
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 130%;
  left: -30%;
  background-color: white;
  border: 1px solid #11c9a7;
  border-radius: 12px;
  padding: 8px 0;
  z-index: 1000;
  width: 99px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.04);
`;

const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  padding: 9px 15px;
  color: #111111;
  cursor: pointer;
  text-align: center;

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
