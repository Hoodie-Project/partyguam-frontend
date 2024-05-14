'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { Button, Txt } from '@/components/atoms';
import { Select } from '@/components/molecules';
import { useAuthStore } from '@/stores/auth';
import type { Position } from '@/types/user';

import data from './postion.json';

export const positionData = (
  data: Position[],
): { mains: { id: number; value: string }[]; subs: { id: number; value: string }[] } => {
  const mains: { id: number; value: string }[] = [];
  const subs: { id: number; value: string }[] = [];

  const mainSet = new Set<string>();

  data.forEach(item => {
    if (!mainSet.has(item.main)) {
      mainSet.add(item.main);
      mains.push({ id: mains.length + 1, value: item.main });
    }

    subs.push({ id: item.id, value: item.sub });
  });

  return { mains, subs };
};

export default function SelectPosition() {
  const { nickname } = useAuthStore(state => state);
  const { mains, subs } = positionData(data);
  const router = useRouter();

  const [main직군, setMain직군] = useState('');
  const [sub직군, setSub직군] = useState('');
  const [main직무, setMain직무] = useState('');
  const [sub직무, setSub직무] = useState('');
  const [main경력, setMain경력] = useState('');
  const [sub경력, setSub경력] = useState('');

  return (
    <Container>
      <SectionTitle>
        <Txt fontWeight="bold" fontSize={24} fontColor="black">
          {nickname || '***'}님의 <br /> 경력과 포지션을 입력해 주세요.
        </Txt>
        <Txt fontColor="black" fontWeight="normal" fontSize={18}>
          경력과 포지션을 입력하고 파티를 추천받으세요.
        </Txt>
      </SectionTitle>
      <GridTitle>
        <Txt fontWeight="bold" fontSize={20} fontColor="black">
          주포지션
        </Txt>
        <Txt fontWeight="bold" fontSize={20} fontColor="black">
          부포지션
        </Txt>
      </GridTitle>
      <GridContainer>
        <Select
          placeholder="경력"
          options={[
            { id: 1, value: '신입' },
            { id: 2, value: '1년' },
            { id: 3, value: '2년' },
            { id: 4, value: '3년' },
            { id: 5, value: '4년' },
          ]}
          value={main경력}
          onClick={(e: React.MouseEvent<HTMLLIElement>) => {
            const selected = e.currentTarget.textContent;
            setMain경력(selected || '');
          }}
        />
        <Select
          placeholder="경력"
          options={[
            { id: 1, value: '신입' },
            { id: 2, value: '1년' },
            { id: 3, value: '2년' },
            { id: 4, value: '3년' },
            { id: 5, value: '4년' },
          ]}
          value={sub경력}
          onClick={(e: React.MouseEvent<HTMLLIElement>) => {
            const selected = e.currentTarget.textContent;
            setSub경력(selected || '');
          }}
        />
        <Select
          placeholder="직군"
          options={mains}
          value={main직군}
          onClick={(e: React.MouseEvent<HTMLLIElement>) => {
            const selected = e.currentTarget.textContent;
            setMain직군(selected || '');
          }}
        />
        <Select
          placeholder="직군"
          options={mains}
          value={sub직군}
          onClick={(e: React.MouseEvent<HTMLLIElement>) => {
            const selected = e.currentTarget.textContent;
            setSub직군(selected || '');
          }}
        />
        <Select
          placeholder="직무"
          options={subs}
          value={main직무}
          onClick={(e: React.MouseEvent<HTMLLIElement>) => {
            const selected = e.currentTarget.textContent;
            setMain직무(selected || '');
          }}
        />
        <Select
          placeholder="직무"
          options={subs}
          value={sub직무}
          onClick={(e: React.MouseEvent<HTMLLIElement>) => {
            const selected = e.currentTarget.textContent;
            setSub직무(selected || '');
          }}
        />
      </GridContainer>
      {/* Note. ButtonContainer 공통 분리 로직 작성 필요
      -----> 다음 버튼 비활성화 로직 추가 */}
      <ButtonsContainer>
        <Button
          shadow="shadow2"
          onClick={e => {
            e.preventDefault();
            router.push('/join/detail?num=3');
          }}
          disabled={main직군 === '' || main직무 === '' || main경력 === ''}
        >
          <Txt fontColor="black" fontSize={18} fontWeight="bold">
            다음
          </Txt>
        </Button>
        <Txt
          fontColor="grey500"
          fontSize={18}
          fontWeight="bold"
          textDecoration="underline"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            router.push('/join/detail?num=3');
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

const GridTitle = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  margin-bottom: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, 1fr);
  row-gap: 12px;
  column-gap: 20px;
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
