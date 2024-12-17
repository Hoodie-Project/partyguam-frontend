'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import ErrorIcon from '@mui/icons-material/Error';
import { isEqual } from 'lodash';

import { fetchGetUsers } from '@/apis/auth';
import { fetchDeletePersonality, fetchGetPersonality, fetchPostPersonality } from '@/apis/detailProfile';
import { Button, Txt } from '@/components/_atoms';
import { CheckItem, Toast } from '@/components/_molecules';
import { useAuthStore } from '@/stores/auth';
import { useSelectPersonalityStore } from '@/stores/detailProfile';
import type { PersonalityQuestion, SelectedPersonality, UsersMeResponse } from '@/types/user';

type Props = {
  editType?: 'time' | 'others';
  handleResetTimeEdit?: () => void;
  handlesubmitTimeEdit?: () => void;
};

export default function SelectPersonality({ editType }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [personalityData, setPersonalityData] = useState<PersonalityQuestion[]>([]);
  const [detailNum, setDetailNum] = useState(searchParams.get('num') || 1);
  const [isToast, setIsToast] = useState(false);

  const [selected, setSelected] = useState<
    {
      id: number;
      personalityQuestionId: number;
      content: string;
    }[]
  >([]);

  const {
    setSelectedQ1,
    selectedQ1,
    setSelectedQ2,
    selectedQ2,
    setSelectedQ3,
    selectedQ3,
    setSelectedQ4,
    selectedQ4,
    setPersonalityCompletion,
  } = useSelectPersonalityStore();
  const user = useAuthStore();

  useEffect(() => {
    (async () => {
      const response = await fetchGetPersonality();
      setPersonalityData(response);
    })();
  }, []);

  useEffect(() => {
    const updatedSelected = user.userPersonalities
      .filter(item => item.personalityOption.personalityQuestion.id === Number(detailNum) - 2)
      .map(item => ({
        id: item.personalityOption.id,
        personalityQuestionId: item.personalityOption.personalityQuestion.id,
        content: item.personalityOption.content,
      }));

    setSelected(updatedSelected);
  }, [detailNum, user.userPersonalities]);

  useEffect(() => {
    const updateSelectedState = (questionId: number, setSelected: Function) => {
      const filteredOptions = user.userPersonalities
        .filter(item => item.personalityOption.personalityQuestion.id === questionId)
        .map(item => item.personalityOption.id);

      setSelected([
        {
          personalityQuestionId: questionId,
          personalityOptionId: filteredOptions.length > 0 ? filteredOptions : [],
        },
      ]);
    };

    switch (Number(detailNum) - 2) {
      case 1:
        updateSelectedState(1, setSelectedQ1);
        break;
      case 2:
        updateSelectedState(2, setSelectedQ2);
        break;
      case 3:
        updateSelectedState(3, setSelectedQ3);
        break;
      case 4:
        updateSelectedState(4, setSelectedQ4);
        break;
      default:
        break;
    }
  }, [user, detailNum, setSelectedQ1, setSelectedQ2, setSelectedQ3, setSelectedQ4]);

  useEffect(() => {
    if (searchParams.get('num')) setDetailNum(Number(searchParams.get('num')));
    setSelected([]);
  }, [searchParams]);

  const progress = useMemo(
    () =>
      personalityData.map((question, index) => ({
        stepNum: question.id,
        currentStep: Number(detailNum) - 2 === question.id,
        questionCnt: question.responseCount,
        question: question.content,
        personalityOptions: personalityData[index].personalityOptions || [],
      })),
    [detailNum, personalityData],
  );

  const currentStep = progress.find(step => step.currentStep) || progress[0] || '';

  const handleSelectOption = (
    selectedOption: {
      id: number;
      personalityQuestionId: number;
      content: string;
    },
    questionCnt: number,
  ) => {
    setSelected(prevSelected => {
      const index = prevSelected.findIndex(option => option.id === selectedOption.id);
      const newSelected = [...prevSelected];

      if (index > -1) {
        newSelected.splice(index, 1);
      } else {
        if (newSelected.length >= questionCnt) {
          setIsToast(true);
          return prevSelected;
        }
        newSelected.push(selectedOption);
      }

      setIsToast(false);
      return newSelected;
    });
  };

  const convertToSelectedPersonality = (
    options: {
      id: number;
      personalityQuestionId: number;
      content: string;
    }[],
  ): SelectedPersonality[] => {
    const grouped = options.reduce<Record<number, number[]>>((acc, option) => {
      const questionId = option.personalityQuestionId; // questionId를 키로 사용

      if (!acc[questionId]) {
        acc[questionId] = [];
      }
      acc[questionId].push(option.id); // 옵션 ID만 배열에 추가

      return acc;
    }, {});

    return Object.entries(grouped).map(([questionId, optionIds]) => ({
      personalityQuestionId: Number(questionId), // questionId를 사용
      personalityOptionId: optionIds, // optionIds를 배열로 반환
    }));
  };

  // 세부 회원가입 시 다음 버튼
  const handleClickNextBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const selectedPersonality = convertToSelectedPersonality(selected);

    switch (Number(detailNum) - 2) {
      case 1:
        setSelectedQ1(selectedPersonality);
        break;
      case 2:
        setSelectedQ2(selectedPersonality);
        break;
      case 3:
        setSelectedQ3(selectedPersonality);
        break;
      case 4:
        setSelectedQ4(selectedPersonality);
        break;
      default:
        break;
    }

    try {
      let res = await fetchPostPersonality(selectedPersonality);

      if (res && res.status === 409) {
        // 409 Conflict 에러 처리
        await fetchDeletePersonality(Number(detailNum) - 2);
        res = await fetchPostPersonality(selectedPersonality);
      }

      if (res.ok) {
        setPersonalityCompletion(Number(detailNum) - 2);
        const userResponse = await fetchGetUsers();
        setAuth(userResponse);
      } else {
        console.error('Post request failed:', res.statusText);
      }
    } catch (error) {
      console.error('Error in handleClickNextBtn:', error);
    } finally {
      // 다음 단계로 넘어가기
      if (editType == null) {
        if (Number(detailNum) === 6) {
          router.push('/join/detail/success');
        } else {
          router.push(`/join/detail?num=${Number(detailNum) + 1}`);
        }
      }
    }
  };

  console.log('editType > ', editType == null);

  return (
    <Container>
      <SectionTitle noMarginTop={editType == 'others'}>
        <Txt fontWeight="bold" fontSize={24} fontColor="black">
          {currentStep?.question}
        </Txt>

        <Txt fontColor="black" fontWeight="normal" fontSize={18}>
          비슷한 성향의 파티원을 추천해 드려요. (최대 {currentStep.questionCnt}개)
        </Txt>
      </SectionTitle>
      <OptionListWrapper isEditMode={editType != null}>
        {currentStep.personalityOptions &&
          currentStep.personalityOptions.map(option => (
            <CheckItem
              key={option.id}
              label={option.content}
              isClick={
                selected.some(item => item.id === option.id) || selected.some(item => item.content === option.content)
              }
              clickBackground="greenLight300"
              defaultBackground="white"
              clickBorder="greenLight100"
              defaultBorder="grey200"
              pointer={selected.length < currentStep.questionCnt}
              onClick={() => handleSelectOption(option, currentStep.questionCnt)}
            />
          ))}
      </OptionListWrapper>
      <Toast
        visible={isToast}
        onClose={() => setIsToast(false)}
        label={`최대 ${currentStep.questionCnt}개까지 선택할 수 있어요.`}
        position={
          editType != null
            ? 120
            : (() => {
                if (Number(detailNum) == 3) return 180;
                return 120;
              })()
        }
        icon={<ErrorIcon fontSize="small" />}
      />
      {editType == 'others' && (
        <ButtonsRowContainer>
          <Button
            shadow="shadow2"
            backgroudColor="disableWhite"
            height="l"
            style={{ width: '110px' }}
            borderColor={selected.length === 0 ? 'grey200' : 'primaryGreen'}
            onClick={() => setSelected([])}
            disabled={selected.length == 0}
          >
            <Txt fontColor={selected.length == 0 ? 'grey400' : 'black'} fontSize={18} fontWeight="bold">
              초기화
            </Txt>
          </Button>
          <Button
            shadow="shadow2"
            height="l"
            style={{ width: '280px' }}
            onClick={handleClickNextBtn}
            disabled={
              selected.flatMap(item => item.id).length == 0 ||
              isEqual(
                user.userPersonalities
                  .filter(item => item.personalityOption.personalityQuestion.id === Number(detailNum) - 2)
                  .map(item => item.personalityOption.id),
                selected.flatMap(item => item.id),
              )
            }
          >
            <Txt
              fontColor={
                selected.flatMap(item => item.id).length == 0 ||
                isEqual(
                  user.userPersonalities
                    .filter(item => item.personalityOption.personalityQuestion.id === Number(detailNum) - 2)
                    .map(item => item.personalityOption.id),
                  selected.flatMap(item => item.id),
                )
                  ? 'grey400'
                  : 'black'
              }
              fontSize={18}
              fontWeight="bold"
            >
              확인
            </Txt>
          </Button>
        </ButtonsRowContainer>
      )}
      {editType == 'time' && (
        <ButtonsRowContainer>
          <Button
            shadow="shadow2"
            backgroudColor="disableWhite"
            height="l"
            style={{ width: '110px' }}
            borderColor={selected.length === 0 ? 'grey200' : 'primaryGreen'}
            onClick={() => setSelected([])}
            disabled={selected.length === 0}
          >
            <Txt fontColor={selected.length === 0 ? 'grey400' : 'black'} fontSize={18} fontWeight="bold">
              초기화
            </Txt>
          </Button>
          <Button
            shadow="shadow2"
            height="l"
            style={{ width: '280px' }}
            onClick={handleClickNextBtn}
            disabled={
              selected.flatMap(item => item.id).length == 0 ||
              isEqual(
                user.userPersonalities
                  .filter(item => item.personalityOption.personalityQuestion.id === Number(detailNum) - 2)
                  .map(item => item.personalityOption.id),
                selected.flatMap(item => item.id),
              )
            }
          >
            <Txt
              fontColor={
                selected.flatMap(item => item.id).length == 0 ||
                isEqual(
                  user.userPersonalities
                    .filter(item => item.personalityOption.personalityQuestion.id === Number(detailNum) - 2)
                    .map(item => item.personalityOption.id),
                  selected.flatMap(item => item.id),
                )
                  ? 'grey400'
                  : 'black'
              }
              fontSize={18}
              fontWeight="bold"
            >
              확인
            </Txt>
          </Button>
        </ButtonsRowContainer>
      )}
      {editType == null && (
        <ButtonsContainer>
          <Button shadow="shadow2" onClick={handleClickNextBtn} disabled={selected.length === 0}>
            <Txt fontColor={selected.length === 0 ? 'grey400' : 'black'} fontSize={18} fontWeight="bold">
              {Number(detailNum) === 6 ? '완료' : '다음'}
            </Txt>
          </Button>
          <Txt
            fontColor="grey500"
            fontSize={18}
            fontWeight="bold"
            textDecoration="underline"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (Number(detailNum) == 6) {
                router.push('/join/detail/success');
              } else {
                router.push(`/join/detail?num=${Number(detailNum) + 1}`);
              }
            }}
          >
            건너뛰기
          </Txt>
        </ButtonsContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SectionTitle = styled.div<{ noMarginTop?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: ${({ noMarginTop }) => (noMarginTop ? '20px 0px 3.75rem 0px' : '5rem 0px 3.75rem 0px')};
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-top: 12px;
  margin-bottom: 58px;
`;

const OptionListWrapper = styled.div<{ isEditMode: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: ${({ isEditMode }) => (isEditMode ? '68px' : '7.9375rem')};
`;

const ButtonsRowContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
function setAuth(userResponse: UsersMeResponse) {
  throw new Error('Function not implemented.');
}
