'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ArrowBackIosNew } from '@mui/icons-material';

import { Button, DateInput, Input, Txt } from '@/components/atoms';

export default function Join() {
  const [joinBtnDisabled, setJoinBtnDisabled] = useState(true);

  return (
    <JoinContainer>
      <JoinHeader>
        <GoBackBtn>
          <ArrowBackIosNew />
          <Txt>뒤로 가기</Txt>
        </GoBackBtn>
        <Txt fontSize={20} fontWeight="bold">
          가입하기
        </Txt>
      </JoinHeader>
      <JoinForm>
        <JoinField>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            이메일을 확인해 주세요.
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            이메일은 변경할 수 없어요.
          </Txt>
          <Input placeholder="disabled input" disabled />
        </JoinField>

        <JoinField>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            닉네임을 입력해 주세요.
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            닉네임은 변경할 수 없어요.
          </Txt>
          <FlexRow>
            <Input placeholder="15자 이내로 입력해 주세요. (영문/한글/숫자)" />
            <Button color="white" label="중복 확인" width="s" />
          </FlexRow>
        </JoinField>

        <JoinField>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            생년월일을 알려주세요.
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            프로필에서 노출 여부를 설정할 수 있어요.
          </Txt>
          <DateInput placeholder="ex. 2000-01-01" />
        </JoinField>

        <JoinField>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            성별은 어떻게 되시나요?
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            프로필에서 노출 여부를 설정할 수 있어요.
          </Txt>
          <FlexRow>
            <Button color="white" label="남자" width="m" />
            <Button color="white" label="여자" width="m" />
          </FlexRow>
        </JoinField>

        <Button label="가입 완료" style={{ marginBottom: 60 }} disabled={joinBtnDisabled} />
      </JoinForm>
    </JoinContainer>
  );
}

const JoinContainer = styled.section`
  padding-top: 84px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const JoinHeader = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 77.75rem;
  height: 3.75rem;
`;

const GoBackBtn = styled.button`
  display: flex;
  align-items: center;
  justify-self: flex-start;
  background-color: transparent;
  font-weight: bold;
  font-size: 18px;
  color: var(--grey500);
  margin-right: 30.375rem;
`;

const JoinForm = styled.section`
  display: flex;
  padding-top: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 77.75rem;
`;

const JoinField = styled.div`
  display: flex;
  padding-bottom: 60px;
  width: 25rem;
  flex-direction: column;
  align-items: flex-start;
`;

const FlexRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 8px;
`;
