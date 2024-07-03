'use client';
import React, { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';

import ImageAddIcon from '@/assets/icon/image_add.svg';
import { Balloon, Button, Input, Square, Txt } from '@/components/_atoms';
import { PageHeader, Select, TipBox } from '@/components/_molecules';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';

export default function PartyCreate() {
  const [파티명value, set파티명value] = useState<string>('');
  const [파티유형value, set파티유형value] = useState<string>('');
  const [파티유형optionList, set파티유형optionList] = useState<{ id: number; type: string }[]>([]);
  const [파티소개글value, set파티소개글value] = useState<string>('');
  const [isVisibleBalloon, setIsVisibleBalloon] = useState(true);
  const [createDisable, setCreateDisable] = useState(true);

  // useEffect(() => {
  //   (async () => {
  //     const response = await fetchGetPartyTypes();
  //     set파티유형optionList(response);
  //   })();
  // }, []);

  const 파티명InputState = useMemo(() => {
    if (파티명value.length > 15) return 'warn';
    if (파티명value.length > 0 && 파티명value.length <= 15) return 'success';
    return 'default';
  }, [파티명value]);

  const handle파티명Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    set파티명value(e.target.value);
  }, []);

  return (
    <SContainer>
      <PageHeader title="파티 생성하기" />
      <PartyCreateContainer>
        <Square width="390px" height="293px" radiusKey="base" backgroundColor="grey300" shadowKey="none">
          <ImageAddIcon />
        </Square>
        {isVisibleBalloon && (
          <Balloon
            width="163px"
            height="30px"
            onClose={() => {
              setIsVisibleBalloon(false);
            }}
            style={{
              marginTop: '20px',
            }}
          >
            <Txt fontSize={14} fontColor="white">
              <Txt fontSize={14} fontColor="primaryGreen">
                4:3 비율
              </Txt>
              이 가장 예뻐요
            </Txt>
          </Balloon>
        )}
        <SFlexRowFull style={{ gap: 20, marginTop: 54 }}>
          <SFlexColumnFull>
            <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
              파티명
            </Txt>
            <Txt fontSize={16} style={{ marginBottom: 20 }}>
              직관적인 파티명을 사용하시면 조회 수가 올라가요.
            </Txt>
            <Input
              value={파티명value}
              inputState={파티명InputState}
              onChange={handle파티명Change}
              onClear={() => {
                set파티명value('');
              }}
              placeholder="15자 이내로 입력해 주세요"
              shadow="shadow1"
              maxCount={15}
            />
          </SFlexColumnFull>
          <SFlexColumnFull>
            <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
              파티 유형
            </Txt>
            <Txt fontSize={16} style={{ marginBottom: 20 }}>
              파티가 목표로 하는 유형을 선택해 주세요.
            </Txt>
            <Select placeholder="미정" height="m" onClick={() => {}} />
          </SFlexColumnFull>
        </SFlexRowFull>
        <SMargin margin="120px 0px 0px 0px" />
        <SFlexColumnFull>
          <Txt fontSize={20} fontWeight="bold">
            파티 소개 글
          </Txt>

          <SMargin margin="0px 0px 4px 0px" />
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            파티의 방향성, 참고사항 등을 자유롭게 적어 주세요.
          </Txt>
          <TipBox
            shadowKey="shadow1"
            width="100%"
            height="92px"
            backgroundColor="grey100"
            borderColor="grey200"
            radiusKey="base"
            chipFontColor="white"
            chipSize="small"
            chipLabel="TIP"
            chipFontWeight="semibold"
            chipFontSize={16}
            chipColor="primaryGreen"
            chipHeight="20px"
            chipWidth="41px"
            titleText={
              <TipBox.Txt fontWeight="semibold" fontSize={16} fontColor="grey600">
                내용을 추천해 드려요.
              </TipBox.Txt>
            }
            contentText={
              <TipBox.Txt fontWeight="normal" fontSize={16} fontColor="grey600">
                어떤 활동을 하나요? 규칙이 있나요? (출석, 강퇴 등)
              </TipBox.Txt>
            }
          />
          <SMargin margin="10px" />
          <Input.TextArea
            height="320px"
            maxCount={250}
            placeholder="새로운 프로젝트를 위해 모여 함께 아이디어를 나누고 계획을 세우는 파티를 개최합니다!
            &#13;&#10;창의적인 아이디어와 열정이 가득한 분들과 함께하는 시간을 가지려고 합니다.
            &#13;&#10;함께 모여 스터디를 시작하거나 프로젝트를 만들어서 성장하는 즐거움을 함께 누려봐요!
            &#13;&#10;함께하고 싶으신 분들은 언제든지 환영입니다!"
          />
        </SFlexColumnFull>
        <SMargin margin="120px 0px 0px 0px" />
        <SFlexColumnFull>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            내 포지션
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            파티 내에서 본인의 포지션을 입력해 주세요.
          </Txt>
          <SFlexRowFull style={{ justifyContent: 'space-between', gap: '20px' }}>
            <Select placeholder="직군" height="m" onClick={() => {}} />
            <Select placeholder="직무" height="m" onClick={() => {}} />
          </SFlexRowFull>
        </SFlexColumnFull>
        <SMargin margin="200px 0px 0px 0px" />
        <SFlexRowFull style={{ justifyContent: 'space-between' }}>
          <Button
            style={{ marginBottom: 60 }}
            height="l"
            width="base"
            backgroudColor="grey100"
            radius="base"
            shadow="shadow1"
            borderColor="grey200"
            onClick={() => {}}
          >
            <Txt fontWeight="bold" fontColor="grey400">
              취소
            </Txt>
          </Button>
          <Button
            style={{ marginBottom: 60 }}
            disabled={createDisable}
            height="l"
            width="base"
            backgroudColor="primaryGreen"
            radius="base"
            shadow="shadow1"
            onClick={() => {}}
          >
            <Txt fontWeight="bold" fontColor={createDisable ? 'grey400' : 'black'}>
              생성하기
            </Txt>
          </Button>
        </SFlexRowFull>
      </PartyCreateContainer>
    </SContainer>
  );
}

const PartyCreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 51.25rem;
  height: auto;
  margin-top: calc(3.125rem + 3.5rem);
`;
