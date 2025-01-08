'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import ErrorIcon from '@mui/icons-material/Error';
import { isEqual } from 'lodash';

import { fetchGetUsers } from '@/apis/auth';
import { fetchDeletePersonality, fetchGetPersonality, fetchPostPersonality } from '@/apis/detailProfile';
import { Button, Txt } from '@/components/_atoms';
import { CheckItem, Toast } from '@/components/_molecules';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { useSelectPersonalityStore } from '@/stores/detailProfile';
import { SFlexColumn } from '@/styles/components';
import type { PersonalityQuestion, SelectedPersonality } from '@/types/user';

export default function MySelectPersonality() {
  const searchParams = useSearchParams();
  const [personalityData, setPersonalityData] = useState<PersonalityQuestion[]>([]);
  const [detailNum, setDetailNum] = useState(searchParams.get('num') || 1);
  const sectionRefs = useRef<HTMLDivElement[]>([]); // 각 섹션을 참조하는 ref 배열
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<number>(0);

  const [isToast, setIsToast] = useState(false);
  const { setAuth } = useAuthStore();
  const { closeModal } = useModalContext();

  const router = useRouter();

  const [selected, setSelected] = useState<
    {
      id: number;
      personalityQuestionId: number;
      content: string;
    }[]
  >([]);

  const { setSelectedQ2, setSelectedQ3, setSelectedQ4, setPersonalityCompletion } = useSelectPersonalityStore();
  const user = useAuthStore();

  useEffect(() => {
    (async () => {
      const response = await fetchGetPersonality();
      setPersonalityData(response);
    })();
  }, []);

  useEffect(() => {
    const updatedSelected = user.userPersonalities
      .filter(item => item.personalityOption.personalityQuestion.id !== 1)
      .map(item => ({
        id: item.personalityOption.id,
        personalityQuestionId: item.personalityOption.personalityQuestion.id,
        content: item.personalityOption.content,
      }));

    setSelected(updatedSelected);
  }, [detailNum, user.userPersonalities]);

  useEffect(() => {
    if (searchParams.get('num')) setDetailNum(Number(searchParams.get('num')));
    setSelected([]);
  }, [searchParams]);

  console.log('personalityData > ', personalityData);

  const progress = useMemo(
    () =>
      personalityData
        ?.map((question, index) => ({
          stepNum: question.id,
          currentStep: Number(detailNum) - 2 === question.id,
          questionCnt: question.responseCount,
          question: question.content,
          personalityOptions: personalityData[index].personalityOptions || [],
        }))
        .filter(item => item.stepNum !== 1),
    [detailNum, personalityData],
  );

  const handleSelectOption = (
    selectedOption: {
      id: number;
      personalityQuestionId: number;
      content: string;
    },
    questionCnt: number,
  ) => {
    setSelected(prevSelected => {
      const isOptionSelected = prevSelected.some(option => option.id === selectedOption.id);
      let updatedSelected;

      // 이미 선택된 경우: 선택 해제
      if (isOptionSelected) {
        updatedSelected = prevSelected.filter(option => option.id !== selectedOption.id);
      } else {
        // 새로 선택된 경우: 최대 선택 개수 확인 후 추가
        if (
          prevSelected.filter(option => option.personalityQuestionId === selectedOption.personalityQuestionId).length >=
          questionCnt
        ) {
          setIsToast(true); // 최대 개수 초과 시 토스트 알림
          return prevSelected;
        }
        updatedSelected = [...prevSelected, selectedOption];
      }

      setIsToast(false);
      return updatedSelected;
    });
  };

  const handleReset = () => {
    setSelected(prevSelected => {
      const currentQuestionId = progress[activeTab].stepNum;
      // Keep selections from other sections, remove only current section's selections
      return prevSelected.filter(item => item.personalityQuestionId !== currentQuestionId);
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
  const handleClickEditBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const selectedPersonality = convertToSelectedPersonality(selected);

    switch (Number(detailNum) - 2) {
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

    let res = await fetchPostPersonality(selectedPersonality);

    if (res && res.status === 409) {
      // 409 Conflict 에러 처리
      await fetchDeletePersonality(2);
      await fetchDeletePersonality(3);
      await fetchDeletePersonality(4);
      res = await fetchPostPersonality(selectedPersonality);
    }

    // 다음 단계로 넘어가기
    setPersonalityCompletion(Number(detailNum) - 2);
    const userResponse = await fetchGetUsers();

    if (!userResponse) {
      console.error('Failed to fetch user data');
      return;
    }

    setAuth(userResponse);

    setTimeout(() => {
      closeModal();
      router.replace('/my/profile');
      router.refresh();
    }, 0);
  };

  console.log('progress > ', progress);

  useEffect(() => {
    if (!containerRef.current || sectionRefs.current.length === 0) return;

    const options = {
      root: containerRef.current,
      rootMargin: '-50% 0px',
      threshold: 0,
    };

    const callback: IntersectionObserverCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            setActiveTab(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [progress]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Container ref={containerRef}>
      <TabListContainer>
        {progress.map((step, index) => (
          <TabButton
            key={index}
            isActive={activeTab === index}
            onClick={() => {
              handleTabClick(index);
            }}
            style={{ fontSize: '16px', fontWeight: 600 }}
          >
            {`${index + 1}단계`}
          </TabButton>
        ))}
      </TabListContainer>
      {progress.map((step, index) => (
        <Section ref={el => (sectionRefs.current[index] = el!)} key={index}>
          {activeTab === index && (
            <Toast
              visible={isToast}
              onClose={() => setIsToast(false)}
              label={`최대 ${step.questionCnt}개까지 선택할 수 있어요.`}
              position={80}
              icon={<ErrorIcon fontSize="small" />}
            />
          )}
          <SectionTitle>
            <SFlexColumn style={{ gap: '7px' }}>
              <Txt fontWeight="bold" fontSize={24} fontColor="black">
                {step?.question}
              </Txt>

              <Txt fontColor="black" fontWeight="normal" fontSize={18}>
                비슷한 성향의 파티원을 추천해 드려요.{' '}
                {step.questionCnt !== 1 && (
                  <Txt fontColor="black" fontWeight="normal" fontSize={18}>
                    (최대 {step.questionCnt}개)
                  </Txt>
                )}
              </Txt>
            </SFlexColumn>
            <ResetButton
              disabled={!selected.some(item => item.personalityQuestionId === progress[activeTab].stepNum)}
              onClick={handleReset}
            >
              <Txt fontSize={14} fontColor="greenDark100" style={{ textWrap: 'nowrap' }}>
                초기화
              </Txt>
              <AutorenewRoundedIcon style={{ color: '#11C9A7', width: '16px', height: '16px', marginTop: '7.4px' }} />
            </ResetButton>
          </SectionTitle>
          <OptionListWrapper>
            {step.personalityOptions &&
              step.personalityOptions.map(option => (
                <CheckItem
                  key={option.id}
                  label={option.content}
                  isClick={
                    selected.some(item => item.id === option.id) ||
                    selected.some(item => item.content === option.content)
                  }
                  clickBackground="greenLight300"
                  defaultBackground="white"
                  clickBorder="greenLight100"
                  defaultBorder="grey200"
                  pointer={selected.length < step.questionCnt}
                  onClick={() => handleSelectOption(option, step.questionCnt)}
                />
              ))}
          </OptionListWrapper>
        </Section>
      ))}

      <ButtonsRowContainer>
        <Button
          shadow="shadow2"
          height="l"
          style={{ width: '400px', position: 'fixed', bottom: '48px' }}
          onClick={handleClickEditBtn}
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
            적용하기
          </Txt>
        </Button>
      </ButtonsRowContainer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 800px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
  padding-top: 100px; /* 탭 높이만큼 추가 */
`;

const Section = styled.div`
  width: 100%;
  margin-top: 20px; /* 섹션 간 여백 */
  scroll-margin-top: 118px;
`;
const SectionTitle = styled.div<{ noMarginTop?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 7px;
  margin-bottom: 40px;
`;

const OptionListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 7.9375rem;
`;

const ButtonsRowContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const TabListContainer = styled.div`
  background-color: white;
  position: fixed;
  top: 0; /* 최상단 고정 */
  left: 40px;
  display: flex;
  align-items: center;
  width: 85%;
  padding-top: 50px;
  gap: 20px;
`;

const TabButton = styled.button<{
  isActive: boolean;
}>`
  width: 55px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 20px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  color: ${({ isActive }) => (isActive ? '#000' : '#999999')};
  border-bottom: ${({ isActive }) => (isActive ? '4px solid #21ECC7' : '4px solid transparent')};

  padding: 13px 8px;
  &:hover {
    color: #000;
  }
`;

const ResetButton = styled.button`
  display: flex;
  flex-direction: row;
`;
