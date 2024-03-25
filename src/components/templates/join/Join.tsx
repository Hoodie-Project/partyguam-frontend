'use client';
import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { ArrowBackIosNew } from '@mui/icons-material';
import { startOfDay } from 'date-fns';

import { Button, DateInput, Input, Txt } from '@/components/atoms';
import { usePersonalInfo } from '@/hooks';

export default function Join() {
  const {
    joinInput,
    setJoinInput,
    isNicknameConfirmed,
    setIsNicknameConfirmed,
    isNicknameDuplicated,
    checkNickname,
    nicknameValidate,
    handleBlur,
  } = usePersonalInfo({
    nickname: '',
    birthday: null,
    gender: '',
  });

  const joinBtnDisabled = useMemo(() => {
    const fields = [
      joinInput.nickname,
      joinInput.birthday,
      joinInput.gender,
      isNicknameConfirmed,
      isNicknameDuplicated === false,
    ];
    const validFields = fields.filter(Boolean);
    return validFields.length !== fields.length;
  }, [isNicknameConfirmed, isNicknameDuplicated, joinInput.birthday, joinInput.gender, joinInput.nickname]);

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
        {/* NOTE. email 불러온 뒤 placeholder로 넣어주기 */}
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
            <Input
              onBlur={handleBlur}
              onFocus={() => {
                setIsNicknameConfirmed(true);
              }}
              name="nickname"
              placeholder="15자 이내로 입력해 주세요. (영문/한글/숫자)"
              onChange={e => {
                const { value, name } = e.target;
                setJoinInput({ ...joinInput, [name]: value });
              }}
              value={joinInput.nickname}
              onClear={() => setJoinInput({ ...joinInput, nickname: '' })}
              inputState={nicknameValidate.inputState}
              bottomMessage={nicknameValidate.bottomMessage}
            />
            <Button
              color="white"
              label="중복 확인"
              width="s"
              onClick={e => {
                e.preventDefault();
                checkNickname();
              }}
            />
          </FlexRow>
        </JoinField>

        <JoinField>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            생년월일을 알려주세요.
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            프로필에서 노출 여부를 설정할 수 있어요.
          </Txt>
          <DateInput
            placeholder="ex. 2000-01-01"
            onClear={() => setJoinInput({ ...joinInput, birthday: null })}
            minDate={new Date('1900-01-01')}
            maxDate={startOfDay(new Date())}
            selectDate={joinInput.birthday}
            setSelectDate={newDate =>
              setJoinInput({
                ...joinInput,
                birthday: newDate,
              })
            }
          />
        </JoinField>

        <JoinField>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            성별은 어떻게 되시나요?
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            프로필에서 노출 여부를 설정할 수 있어요.
          </Txt>
          <FlexRow>
            <Button
              color={joinInput.gender === '남자' ? 'disabled' : 'white'}
              label="남자"
              width="m"
              onClick={e => {
                e.preventDefault();
                setJoinInput({ ...joinInput, gender: '남자' });
              }}
            />
            <Button
              color={joinInput.gender === '여자' ? 'disabled' : 'white'}
              label="여자"
              width="m"
              onClick={e => {
                e.preventDefault();
                setJoinInput({ ...joinInput, gender: '여자' });
              }}
            />
          </FlexRow>
        </JoinField>

        <Button label="가입 완료" style={{ marginBottom: 60 }} disabled={joinBtnDisabled} />
      </JoinForm>
    </JoinContainer>
  );
}

const JoinContainer = styled.section`
  padding: 5.25rem 21.25rem 0rem 21.25rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const JoinHeader = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
  width: 100%;
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
`;

const JoinForm = styled.form`
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
