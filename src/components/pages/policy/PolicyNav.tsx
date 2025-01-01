import { usePathname, useRouter } from 'next/navigation';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export default function PolicyNav() {
  const router = useRouter();
  const pathName = usePathname();
  const tabs = [
    { label: '서비스 소개', link: '/policy/introduction' },
    { label: '고객 문의', link: '/policy/inquiry' },
    { label: '이용약관', link: '/policy/service' },
    { label: '개인정보 처리 방침', link: '/policy/privacy' },
  ];

  return (
    <Nav>
      {tabs.map(tab => (
        <Tab key={tab.label} isActive={pathName === tab.link} onClick={() => router.push(`${tab.link}`)}>
          {tab.label}
        </Tab>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  border: 1px solid #e5e5ec;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 60px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  flex: 1;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  border-right: 1px solid #e5e5ec;
  padding: 16px 0px;

  &:last-of-type {
    border-right: none;
  }

  &:hover {
    background-color: #f1f1f5;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: #21ecc7;
      color: black;
      font-weight: bold;
      &:hover {
        background-color: #21ecc7;
      }
    `}
`;
