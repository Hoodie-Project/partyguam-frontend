'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

export default function Footer() {
  const router = useRouter();
  return (
    <FooterWrapper>
      <FooterLinks>
        <FooterLink onClick={() => router.push('/policy/introduction')}>서비스소개</FooterLink>
        <FooterLink onClick={() => router.push('/policy/inquiry')}>고객문의</FooterLink>
        <FooterLink onClick={() => router.push('/policy/service')}>이용약관</FooterLink>
        <FooterLink onClick={() => router.push('/policy/privacy')}>개인정보 처리방침</FooterLink>
      </FooterLinks>
      <FooterCopyright>© 2024 GUAM. All rights reserved.</FooterCopyright>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  bottom: 0;
  width: 100%;
  background-color: #fbfbfb;
  padding: 73px 0px 52px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 39px;

  @media (max-width: 673px) {
    display: none;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: row;
  gap: 59px;
  justify-content: center;
  align-items: center;
`;

const FooterLink = styled.a`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterCopyright = styled.div`
  font-size: 24px;
  color: #000000;
  text-align: center;
`;
