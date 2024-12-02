'use client';
import React from 'react';
import styled from '@emotion/styled';

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterLinks>
        <FooterLink>서비스소개</FooterLink>
        <FooterLink>고객문의</FooterLink>
        <FooterLink>이용약관</FooterLink>
        <FooterLink>개인정보 처리방침</FooterLink>
      </FooterLinks>
      <FooterCopyright>© 2024 GUAM. All rights reserved.</FooterCopyright>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.div`
  width: 100%;
  background-color: #fbfbfb;
  padding: 73px 0px 52px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 39px;
  margin-top: 100px;
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
