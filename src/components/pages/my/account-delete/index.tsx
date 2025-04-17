'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { deleteCookie } from 'cookies-next';

import { fetchUsersSignOut } from '@/apis/auth';
import { Button, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { useAuthStore } from '@/stores/auth';
import { SContainer } from '@/styles/components';

function MyAccountDelete() {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const { logout } = useAuthStore(state => ({
    logout: state.logout,
  }));

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  const handleDelete = () => {
    if (isChecked) {
      fetchUsersSignOut();
      logout();
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      window.location.reload();
    } else {
      alert('안내 사항을 확인하고 동의해 주세요.');
    }
  };

  return (
    <SContainer>
      <PageHeader
        title={
          <Txt fontSize={20} fontWeight="bold" fontColor="failRed">
            회원 탈퇴 전 꼭 읽어주세요
          </Txt>
        }
      />
      <Content>
        <Section>
          <SubTitle>회원 탈퇴 전 유의사항</SubTitle>
          <ul>
            <li>
              회원 탈퇴 시, 소셜 로그인 계정을 통해 등록된 모든 정보가 <span>영구적으로 삭제</span>되며,{' '}
              <span>데이터 복구가 불가능</span>합니다.{' '}
            </li>
            <li>
              회원 탈퇴 후에는 진행 중인 <span>모든 지원과 파티 참여가 자동으로 취소</span>되며, 이에 따른{' '}
              <span>혜택이나 보상</span>을 받을 수 없습니다.{' '}
            </li>
          </ul>
        </Section>

        <Section>
          <SubTitle>데이터 백업</SubTitle>
          <ul>
            <li>
              회원 탈퇴 전에 소셜 로그인 계정과 연결된 데이터를 <span>반드시 백업</span>하세요. 탈퇴 후에는 데이터를
              복구하거나 접근할 수 없습니다.
            </li>
          </ul>
        </Section>

        <Section>
          <SubTitle>파티 및 참여 기록 관리</SubTitle>
          <ul>
            <li>
              회원 탈퇴 후에도 서비스의 안정성과 다른 사용자들의 활동 이력을 보장하기 위해 파티 내 파티 참여 기록은
              남아있을 수 있습니다. <br />
              그러나, 이 기록은 귀하의 개인정보를 포함하지 않으며, 탈퇴 후에는 익명 처리됩니다.
            </li>
            <li>회원 탈퇴 후 동일 계정으로 재가입하더라도 이전에 참여했던 파티 및 기록은 복구되지 않습니다.</li>
          </ul>
        </Section>

        <CheckboxWrapper>
          <CustomCheckbox type="checkbox" id="agreement" checked={isChecked} onChange={handleCheck} />
          <label htmlFor="agreement">안내 사항을 모두 확인하였으며, 이에 동의합니다.</label>
        </CheckboxWrapper>

        <Button
          height="l"
          backgroudColor="failRed"
          shadow="shadow2"
          disabled={!isChecked}
          onClick={handleDelete}
          style={{
            width: '100%',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: !isChecked ? 'rgba(220, 0, 0, 0.4)' : '#dc0000',
          }}
        >
          탈퇴 하기
        </Button>
      </Content>
    </SContainer>
  );
}

export default MyAccountDelete;

const Content = styled.div`
  padding-top: 110px;
`;

const Section = styled.section`
  margin-bottom: 60px;
  > ul {
    line-height: 1.4;
    letter-spacing: -0.025em;
    list-style-position: inside;
    font-size: 16px;
    > li {
      margin-bottom: 8px;
    }
    span {
      font-weight: 600;
    }
  }
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const CheckboxWrapper = styled.div`
  background-color: #f1f1f5;
  border-radius: 12px;
  padding: 13px 20px;
  width: 100%;
  margin: 150px 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    cursor: pointer;
  }
`;

const CustomCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid #999999;
  border-radius: 4px;
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #11c9a7;
    border-color: #11c9a7;
  }

  &:checked::before {
    content: '';
    position: absolute;
    top: 1.5px;
    left: 5.5px;
    width: 7px;
    height: 11px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
  }
`;
