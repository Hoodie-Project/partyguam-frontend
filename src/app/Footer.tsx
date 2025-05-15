'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import RightDivider from '@/assets/icon/divider.svg';
import { Txt } from '@/components/_atoms';
import { SFlexRow } from '@/styles/components';

export default function Footer() {
  const router = useRouter();
  return (
    <FooterContainer>
      <FooterWrapper>
        <LeftFooter>
          <Image src="/images/logo/logo2_black.png" alt="파티구함로고" width={129} height={48} />
          <SFlexRow style={{ alignItems: 'center', gap: '6px' }}>
            <Txt fontSize={14}>Contact</Txt>
            <LeftDivider />
            <Txt fontSize={14}>hoodiev.team@gmail.com</Txt>
          </SFlexRow>
          <FooterCopyright>© 2025 PARTYGUHAM. All rights reserved.</FooterCopyright>
        </LeftFooter>
        <RightFooter></RightFooter>
        <FooterLinks>
          <FooterLink onClick={() => router.push('/policy/introduction')}>서비스소개</FooterLink>
          <RightDivider />
          <FooterLink onClick={() => router.push('/policy/inquiry')}>고객문의</FooterLink>
          <RightDivider />
          <FooterLink onClick={() => router.push('/policy/service')}>이용약관</FooterLink>
          <RightDivider />
          <FooterLink onClick={() => router.push('/policy/privacy')}>개인정보 처리방침</FooterLink>
        </FooterLinks>
      </FooterWrapper>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  bottom: 0;
  width: 100%;
  height: 179px;
  background-color: #ffffff;
  border-top: 1px solid #f1f1f5;
  padding: 36px 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 673px) {
    display: none;
  }
`;

const FooterWrapper = styled.div`
  width: 77.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 39px;
`;

const LeftFooter = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightFooter = styled.div``;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: center;
  align-items: center;
`;

const FooterLink = styled.a`
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterCopyright = styled.div`
  font-size: 14px;
  color: #000000;
  text-align: center;
  line-height: 140%;
  letter-spacing: -2.5%;
`;

const LeftDivider = styled.div`
  height: 10px;
  width: 1px;
  background-color: #d4d4d4;
`;
