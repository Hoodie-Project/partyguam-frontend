'use client';
import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { startOfDay } from 'date-fns';

import { Button, DateInput, Input, Txt } from '@/components/atoms';
import { usePersonalInfo } from '@/hooks';
import { palette } from '@/styles';

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
          <ArrowBackIosNewRoundedIcon />
          <Txt fontColor="grey500" fontWeight="bold" style={{ marginTop: '2px', marginLeft: '10px' }}>
            뒤로 가기
          </Txt>
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
          <Input placeholder="disabled input" shadow="shadow2" disabled />
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
              shadow="shadow1"
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
              backgroudColor="white"
              width="s"
              height="base"
              radius="base"
              shadow="shadow1"
              borderColor="grey200"
              onClick={e => {
                e.preventDefault();
                checkNickname();
              }}
            >
              <Txt fontColor="grey500">중복 확인</Txt>
            </Button>
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
            shadow="shadow1"
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
              width="m"
              onClick={e => {
                e.preventDefault();
                setJoinInput({ ...joinInput, gender: '남자' });
              }}
              height="base"
              backgroudColor={joinInput.gender === '남자' ? 'greenLight200' : 'white'}
              borderColor={joinInput.gender === '남자' ? 'transparent' : 'grey200'}
              radius="base"
              shadow="shadow1"
            >
              <Txt fontColor="grey500">남자</Txt>
            </Button>
            <Button
              width="m"
              onClick={e => {
                e.preventDefault();
                setJoinInput({ ...joinInput, gender: '여자' });
              }}
              height="base"
              backgroudColor={joinInput.gender === '여자' ? 'greenLight200' : 'white'}
              borderColor={joinInput.gender === '여자' ? 'transparent' : 'grey200'}
              radius="base"
              shadow="shadow1"
            >
              <Txt fontColor="grey500">여자</Txt>
            </Button>
          </FlexRow>
        </JoinField>

        <Button
          style={{ marginBottom: 60 }}
          disabled={joinBtnDisabled}
          height="base"
          width="base"
          backgroudColor="primaryGreen"
          radius="base"
          shadow="shadow2"
        >
          <Txt fontWeight="bold">가입 완료</Txt>
        </Button>
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
  justify-items: center;
  align-items: center;
  gap: 10;
  background-color: transparent;
  font-weight: bold;
  font-size: 18px;
  color: ${palette.grey500};
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
