'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import ErrorIcon from '@mui/icons-material/Error';

import { fetchDeletePersonality, fetchGetPersonality, fetchPostPersonality } from '@/apis/detailProfile';
import { Button, Txt } from '@/components/_atoms';
import { CheckItem, Toast } from '@/components/_molecules';
import { useSelectPersonalityStore } from '@/stores/detailProfile';
import type { PersonalityOption, PersonalityQuestion, SelectedPersonality } from '@/types/user';

export default function SelectPersonality() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [personalityData, setPersonalityData] = useState<PersonalityQuestion[]>([]);
  const [detailNum, setDetailNum] = useState(searchParams.get('num') || 1);
  const [isToast, setIsToast] = useState(false);

  const [selected, setSelected] = useState<PersonalityOption[]>([]);
  const { setSelectedQ1, setSelectedQ2, setSelectedQ3, setSelectedQ4, setPersonalityCompletion } =
    useSelectPersonalityStore();

  useEffect(() => {
    (async () => {
      const response = await fetchGetPersonality();
      setPersonalityData(response);
    })();
  }, []);

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
        questionOptions: personalityData[index].personalityOption || [],
      })),
    [detailNum, personalityData],
  );

  const currentStep = progress.find(step => step.currentStep) || progress[0] || '';

  const handleSelectOption = (selectedOption: PersonalityOption, questionCnt: number) => {
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

  const convertToSelectedPersonality = (options: PersonalityOption[]): SelectedPersonality[] => {
    const grouped = options.reduce<Record<number, number[]>>((acc, option) => {
      if (!acc[option.personalityQuestionId]) {
        acc[option.personalityQuestionId] = [];
      }
      acc[option.personalityQuestionId].push(option.id);
      return acc;
    }, {});

    return Object.entries(grouped).map(([questionId, optionIds]) => ({
      personalityQuestionId: Number(questionId),
      personalityOptionId: optionIds,
    }));
  };

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

    const res = await fetchPostPersonality(selectedPersonality);

    if (res && res.status === 409) {
      await fetchDeletePersonality(Number(detailNum) - 2);
      await fetchPostPersonality(selectedPersonality);
    }
    setPersonalityCompletion(Number(detailNum) - 2);
    if (Number(detailNum) == 6) {
      router.push('/join/detail/success');
    } else {
      router.push(`/join/detail?num=${Number(detailNum) + 1}`);
    }
  };

  return (
    <Container>
      <SectionTitle>
        <Txt fontWeight="bold" fontSize={24} fontColor="black">
          {currentStep?.question}
        </Txt>

        <Txt fontColor="black" fontWeight="normal" fontSize={18}>
          비슷한 성향의 파티원을 추천해 드려요. (최대 {currentStep.questionCnt}개)
        </Txt>
      </SectionTitle>
      <OptionListWrapper>
        {currentStep.questionOptions &&
          currentStep.questionOptions.map(option => (
            <CheckItem
              key={option.id}
              label={option.content}
              isClick={selected.some(item => item.id === option.id)}
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
        position={100}
        icon={<ErrorIcon fontSize="small" />}
      />
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
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 5rem 0px 3.75rem 0px;
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

const OptionListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 7.9375rem;
`;
