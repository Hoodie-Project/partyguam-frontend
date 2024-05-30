'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import ErrorIcon from '@mui/icons-material/Error';

import { Button, Txt } from '@/components/atoms';
import { CheckItem, Toast } from '@/components/molecules';

import questionOptionData from './personality_option.json';
import questionData from './personality_question.json';

export default function SelectPersonality() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detailNum, setDetailNum] = useState(searchParams.get('num') || 1);
  const [isToast, setIsToast] = useState(false);

  const [selected, setSelected] = useState<
    {
      id: number;
      content: string;
    }[]
  >([]);

  useEffect(() => {
    if (searchParams.get('num')) setDetailNum(Number(searchParams.get('num')));
  }, [searchParams]);

  const groupedByQuestionId = useMemo(
    () =>
      questionOptionData.reduce(
        (
          acc: Record<string, { id: number; content: string }[]>,
          item: { id: number; personality_question_id: number; content: string },
        ) => {
          const { personality_question_id, id, content } = item;
          acc[personality_question_id] = acc[personality_question_id] || [];
          acc[personality_question_id].push({ id, content });
          return acc;
        },
        {},
      ),
    [],
  );

  const progress = useMemo(
    () =>
      questionData.map(question => ({
        stepNum: question.id,
        currentStep: Number(detailNum) - 2 === question.id,
        questionCnt: question.response_count,
        question: question.content,
        questionOptions: groupedByQuestionId[question.id] || [],
      })),
    [detailNum, groupedByQuestionId],
  );

  const currentStep = progress.find(step => step.currentStep) || progress[0];

  function handleSelectOption(selectedOption: { id: number; content: string }, questionCnt: number) {
    const index = selected.findIndex(option => option.id === selectedOption.id);
    const newSelected = [...selected];

    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      if (newSelected.length >= questionCnt) {
        setIsToast(true);
        return;
      }
      newSelected.push(selectedOption);
    }

    setSelected(newSelected);
    setIsToast(false);
  }

  return (
    <Container>
      <SectionTitle>
        <Txt fontWeight="bold" fontSize={24} fontColor="black">
          {currentStep.question}
        </Txt>

        <Txt fontColor="black" fontWeight="normal" fontSize={18}>
          비슷한 성향의 파티원을 추천해 드려요. (최대 {currentStep.questionCnt}개)
        </Txt>
      </SectionTitle>
      {/* Note. ButtonContainer 공통 분리 로직 작성 필요
    -----> 다음 버튼 비활성화 로직 추가 */}
      <OptionListWrapper>
        {currentStep.questionOptions.map(option => (
          <CheckItem
            key={option.id}
            label={option.content}
            isClick={selected.some(item => item.id === option.id)}
            clickBackground="greenLight300"
            defaultBackground="white"
            clickBorder="greenLight100"
            defaultBorder="grey200"
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
        <Button
          shadow="shadow2"
          onClick={e => {
            e.preventDefault();
            router.push(`/join/detail?num=${Number(detailNum) + 1}`);
          }}
          disabled={selected.length === 0}
        >
          <Txt fontColor="black" fontSize={18} fontWeight="bold">
            {Number(detailNum) === 6 ? '완료' : '다음'}
          </Txt>
        </Button>
        <Txt
          fontColor="grey500"
          fontSize={18}
          fontWeight="bold"
          textDecoration="underline"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push(`/join/detail?num=${Number(detailNum) + 1}`)}
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
