'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { setCookie } from 'cookies-next';
import { format, startOfDay } from 'date-fns';

import { fetchGetOauthInfo, fetchGetUsers, fetchJoinFormSubmit } from '@/apis/auth';
import { Button, DateInput, Input, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import ConfirmModal from '@/components/features/comfirmModal/ConfirmModal';
import { useFormContext } from '@/contexts/FormContext';
import { useModalContext } from '@/contexts/ModalContext';
import { usePersonalInfo } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { SContainer, SForm } from '@/styles/components';

export default function Join() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [signupData, setSignupData] = useState({ email: '', image: '' });
  const { openModal, closeModal } = useModalContext();
  const { setFormDirty, setFormType } = useFormContext();

  useEffect(() => {
    const fetchSignupData = async () => {
      try {
        const response = await fetchGetOauthInfo();
        setSignupData(response);
      } catch (err) {
        console.error('Error fetching fetchGetOauthInfo >> ', err);
      }
    };
    fetchSignupData();
  }, []);

  useEffect(() => {
    setFormDirty(true);
    setFormType('필수회원가입');
    return () => {
      setFormDirty(false);
      setFormType('');
    };
  }, [setFormDirty, setFormType]);

  const {
    joinInput,
    setJoinInput,
    isNicknameConfirmed,
    setIsNicknameConfirmed,
    isNicknameDuplicated,
    setIsNicknameDuplicated,
    checkNickname,
    nicknameValidate,
    handleBlur,
  } = usePersonalInfo({
    nickname: '',
    birth: null,
    gender: '',
  });

  const joinBtnDisabled = useMemo(() => {
    const fields = [
      joinInput.nickname,
      joinInput.birth,
      joinInput.gender,
      isNicknameConfirmed,
      isNicknameDuplicated === false,
    ];
    const validFields = fields.filter(Boolean);
    return validFields.length !== fields.length;
  }, [isNicknameConfirmed, isNicknameDuplicated, joinInput.birth, joinInput.gender, joinInput.nickname]);

  return (
    <>
      <SContainer>
        <PageHeader
          title="가입하기"
          hrefLabel="뒤로 가기"
          onClickHref={() =>
            openModal({
              children: (
                <ConfirmModal
                  modalTitle="나가기"
                  modalContents={
                    <>
                      회원가입이 완료되지 않았습니다.
                      <br />
                      나가시겠습니까?
                    </>
                  }
                  cancelBtnTxt="취소"
                  submitBtnTxt="나가기"
                />
              ),
              onCancel: () => {
                closeModal();
              },
              onSubmit: () => {
                router.push('/');
                closeModal();
              },
            })
          }
        />
        <SForm>
          <JoinField>
            <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
              이메일을 확인해 주세요.
            </Txt>
            <Txt fontSize={16} style={{ marginBottom: 20 }}>
              이메일은 변경할 수 없어요.
            </Txt>
            <Input placeholder={signupData.email} shadow="shadow2" disabled />
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
                onClear={() => {
                  setJoinInput({ ...joinInput, nickname: '' });

                  setIsNicknameDuplicated(undefined);
                }}
                inputState={nicknameValidate.inputState}
                bottomMessage={nicknameValidate.bottomMessage}
                maxCount={15}
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
                disabled={isNicknameDuplicated === false}
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
              onClear={() => setJoinInput({ ...joinInput, birth: null })}
              minDate={new Date('1900-01-01')}
              maxDate={startOfDay(new Date())}
              selectDate={joinInput.birth}
              setSelectDate={newDate =>
                setJoinInput({
                  ...joinInput,
                  birth: newDate,
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
                  setJoinInput({ ...joinInput, gender: 'M' });
                }}
                height="base"
                backgroudColor={joinInput.gender === 'M' ? 'greenLight200' : 'white'}
                borderColor={joinInput.gender === 'M' ? 'transparent' : 'grey200'}
                radius="base"
                shadow="shadow1"
              >
                <Txt fontColor="grey500">남자</Txt>
              </Button>
              <Button
                width="m"
                onClick={e => {
                  e.preventDefault();
                  setJoinInput({ ...joinInput, gender: 'F' });
                }}
                height="base"
                backgroudColor={joinInput.gender === 'F' ? 'greenLight200' : 'white'}
                borderColor={joinInput.gender === 'F' ? 'transparent' : 'grey200'}
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
            onClick={async e => {
              e.preventDefault();

              const formattedBirth = (joinInput.birth && format(joinInput.birth, 'yyyy-MM-dd')) || '';
              const data = {
                id: 0,
                nickname: joinInput.nickname,
                email: signupData.email,
                image: signupData.image,
                birth: formattedBirth,
                gender: joinInput.gender,
                createdAt: '',
              };

              const response = await fetchJoinFormSubmit(data);
              setCookie('accessToken', response.data.accessToken);
              if (response.status === 201) {
                const userResponse = await fetchGetUsers();
                setAuth(userResponse.data);
                router.push('/join/success');
              }
            }}
          >
            <Txt fontWeight="bold" fontColor={joinBtnDisabled ? 'grey400' : 'black'}>
              가입 완료
            </Txt>
          </Button>
        </SForm>
      </SContainer>
    </>
  );
}

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
