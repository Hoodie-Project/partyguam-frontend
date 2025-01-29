'use client';
// 파티 수정 및 생성 페이지
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import type { CreatePartyResponse } from '@/apis/party';
import {
  fetchDeleteParty,
  fetchGetPartyHome,
  fetchGetPartyRecruitmentsList,
  fetchGetPartyTypes,
  fetchGetPositions,
  fetchPatchParty,
  fetchPostCreateParty,
} from '@/apis/party';
import ImageAddIcon from '@/assets/icon/image_add.svg';
import { Balloon, Button, Input, Square, Txt } from '@/components/_atoms';
import { PageHeader, Select, TipBox } from '@/components/_molecules';
import { ConfirmModal, FloatingMenu } from '@/components/features';
import { PARTY_SETTING_MENU } from '@/constants';
import { useModalContext } from '@/contexts/ModalContext';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';
import type { PartyHomeResponse } from '@/types/party';
import type { Position } from '@/types/user';

type StateType = any;
const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

// TODO. 데이터 정제 로직 걷어내고 query로 api 보내도록 변경 필요
export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  const uniqueMainPositions = Array.from(new Set(data.map(item => item.main)));
  return uniqueMainPositions.map((main, index) => {
    const position = data.find(item => item.main === main);
    return { id: position ? position.id : index + 1, label: main };
  });
};

// TODO. 파티 타입 데이터 변환 -> 이게 최선일까? select list로 들어가는 options type 리펙토링 필수
const transformPartyTypes = (data: { id: number; type: string }[]): { id: number; label: string }[] => {
  return data.map(item => ({
    id: item.id,
    label: item.type,
  }));
};

const filterPositions = (data: Position[], mainCategory: string): { id: number; label: string }[] => {
  return data.filter(item => item.main === mainCategory).map(item => ({ id: item.id, label: item.sub }));
};

type PageParams = {
  partyId?: string;
};

// pathname -> 'CREATE': 파티 생성, 'MODIFY': 파티 수정
export default function PartyEdit({ partyId }: PageParams) {
  const router = useRouter();
  const pathname = usePathname();
  const pageType: 'CREATE' | 'MODIFY' = useMemo(() => {
    if (pathname.includes('create')) return 'CREATE';
    else return 'MODIFY';
  }, [pathname]);

  const { openModal, closeModal } = useModalContext();

  const [positionData, setPositionData] = useState<Position[]>([]);
  const positionList = transformPositionData(positionData);

  const [파티명value, set파티명value] = useState<string>('');
  const [파티유형value, set파티유형value] = useState<{ id: number; label: string }>({ id: 0, label: '' });
  const [파티유형List, set파티유형List] = useState<{ id: number; label: string }[]>([]);
  const [파티소개글value, set파티소개글value] = useState<string>('');
  const [내포지션, set내포지션] = useState({ id: 0, 직군: '', 직무: '' });
  const [파티상태, set파티상태] = useState<string>('');
  const [isVisibleBalloon, setIsVisibleBalloon] = useState(true);
  const [partyHomeData, setPartyHomeData] = useState<PartyHomeResponse | null>(null);

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPath, setImgPath] = useState('');

  const [postResponse, setPostResponse] = useState<CreatePartyResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      if (pageType === 'CREATE') {
        const response = await fetchGetPositions();
        setPositionData(response);
      } else if (pageType === 'MODIFY') {
        const response = await fetchGetPartyHome({ partyId: Number(partyId?.toString()) });
        setPartyHomeData(response);
      }
      const 파티유형 = await fetchGetPartyTypes();
      set파티유형List(transformPartyTypes(파티유형));
    })();
  }, []);

  useEffect(() => {
    if (partyHomeData == null) return;
    set파티명value(partyHomeData?.title);
    set파티유형value({ id: partyHomeData?.partyType.id, label: partyHomeData?.partyType.type });
    set파티소개글value(partyHomeData.content);
    set파티상태(partyHomeData.status);
  }, [partyHomeData]);

  const 내포지션Filtered = useMemo(() => {
    if (내포지션.직군) {
      return filterPositions(positionData, 내포지션.직군);
    }
    return [{ id: 0, label: '' }];
  }, [positionData, 내포지션.직군]);

  const 파티명InputState = useMemo(() => {
    if (파티명value.length > 15) return 'warn';
    if (파티명value.length > 0 && 파티명value.length <= 15) return 'success';
    return 'default';
  }, [파티명value]);

  const 파티소개글InputState = useMemo(() => {
    if (파티소개글value.length > 250) return 'warn';
    if (파티소개글value.length > 0 && 파티소개글value.length <= 250) return 'success';
    return 'default';
  }, [파티소개글value]);

  useEffect(() => {
    console.log('isVisible', isVisibleBalloon);
  }, [isVisibleBalloon]);

  const buttonDisabled = useMemo(() => {
    const commonConditions =
      파티명InputState == 'success' && 파티소개글InputState == 'success' && 파티유형value.id != 0;

    if (pageType === 'CREATE') {
      return !commonConditions && 내포지션.id != 0;
    } else if (pageType === 'MODIFY') {
      return !(commonConditions && 파티상태 !== '');
    }
    return true;
  }, [파티명InputState, 파티소개글InputState, 파티유형value, 내포지션, 파티상태, pageType]);

  const handle파티명Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    set파티명value(e.target.value);
  }, []);

  const handle파티소개글Change = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    set파티소개글value(e.target.value);
  }, []);

  const handleSelectChange =
    (
      setter: React.Dispatch<React.SetStateAction<StateType>>,
      field: string,
      options?: { id: number; label: string }[],
    ) =>
    (e: React.MouseEvent<HTMLLIElement>) => {
      const selectedOption = options?.find(option => option.label === e.currentTarget.textContent);

      setter((prev: any) => ({
        ...prev,
        id: selectedOption?.id || 0,
        [field]: e.currentTarget.textContent || '',
      }));
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImgFile(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgPath(reader.result as string);
      };
    }
  };

  const handleCreatePartyButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (imgFile) {
      formData.append('image', imgFile);
    }
    formData.append('title', 파티명value);
    formData.append('content', 파티소개글value);
    formData.append('partyTypeId', String(파티유형value.id));

    if (pageType === 'CREATE') {
      formData.append('positionId', String(내포지션.id));
      try {
        const res = await fetchPostCreateParty(formData);
        setPostResponse(res);
        onClickApply(res?.id);
      } catch (err) {
        console.error('Error creating party:', err);
      }
    } else if (pageType === 'MODIFY') {
      formData.append('status', 파티상태);
      try {
        const res = await fetchPatchParty({ partyId: Number(partyId), data: formData });
        router.refresh();
      } catch (err) {
        console.error('Error creating party:', err);
      }
    }
  };

  const onClickCancel = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="나가기"
          modalContents={
            <>
              파티 생성이 완료되지 않았어요.
              <br />
              입력하신 내용이 있으면 저장되지 않아요!
              <br />
              그래도 해당 페이지에서 정말 나가시겠어요?
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
    });
  };

  const onClickApply = (partyId?: number) => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="생성 완료"
          modalContents={
            <>
              파티가 생성되었어요!
              <br />
              파티원을 모집해 볼까요?
            </>
          }
          cancelBtnTxt="닫기"
          submitBtnTxt="모집하기"
        />
      ),
      onCancel: () => {
        router.push(`/`);
        closeModal();
      },
      // TODO. 모집하기 모달 route 기획 나와야 함
      onSubmit: () => {
        router.push(`/party/setting/recruit/edit?type=ADD&partyId=${partyId}`);
        closeModal();
      },
    });
  };

  const onClickDeleteParty = () => {
    openModal({
      children: (
        <ConfirmModal
          modalTitle="파티 삭제"
          modalContents={
            <>
              정말로 이 파티를 삭제하시겠어요?
              <br />
              삭제할 시 데이터 복구가 불가해요.
            </>
          }
          cancelBtnTxt="닫기"
          submitBtnTxt="삭제하기"
        />
      ),
      onCancel: () => {
        closeModal();
      },
      onSubmit: async () => {
        await fetchDeleteParty(Number(partyId));
        router.push('/');
        closeModal();
      },
    });
  };

  return (
    <SContainer>
      <PageHeader title={pageType === 'CREATE' ? '파티 생성' : '파티 수정'} />
      {pageType === 'MODIFY' && <FloatingMenu menu={PARTY_SETTING_MENU(partyId?.toString())} />}
      <PartyCreateContainer>
        <Square
          width="390px"
          height="293px"
          radiusKey="base"
          backgroundColor="grey300"
          shadowKey="none"
          style={{ position: 'relative' }}
          onClick={e => {
            e.preventDefault();
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          {partyHomeData?.image || imgPath ? (
            <Image
              alt="파티생성 이미지"
              src={imgPath ? `${imgPath}` : `${BASE_URL}/${partyHomeData?.image}`}
              width={390}
              height={293}
              style={{ borderRadius: '16px' }}
            />
          ) : (
            <ImageAddIcon />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {isVisibleBalloon && (
            <Balloon
              width="163px"
              height="30px"
              onClose={() => {
                setIsVisibleBalloon(false);
              }}
              style={{ position: 'absolute', bottom: '-58px' }}
            >
              <Txt fontSize={14} fontColor="white">
                <Txt fontSize={14} fontColor="primaryGreen">
                  4:3 비율
                </Txt>
                이 가장 예뻐요
              </Txt>
            </Balloon>
          )}
        </Square>

        <SFlexRowFull style={{ gap: 20, marginTop: 108 }}>
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
            <Select
              placeholder="파티 유형 선택"
              height="m"
              eachOptionStyle={{ padding: '20px' }}
              options={파티유형List}
              value={파티유형value.label}
              onClick={(e: React.MouseEvent<HTMLLIElement>) => {
                const selectedOption = 파티유형List.find(option => option.label === e.currentTarget.textContent);
                if (selectedOption) {
                  set파티유형value(selectedOption);
                }
              }}
            />
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
          <SMargin margin="20px" />
          <Input.TextArea
            height="320px"
            maxCount={250}
            inputState={파티소개글InputState}
            onChange={handle파티소개글Change}
            onClear={() => {
              set파티소개글value('');
            }}
            shadow="shadow1"
            value={파티소개글value}
            placeholder="새로운 프로젝트를 위해 모여 함께 아이디어를 나누고 계획을 세우는 파티를 개최합니다!
            &#13;&#10;창의적인 아이디어와 열정이 가득한 분들과 함께하는 시간을 가지려고 합니다.
            &#13;&#10;함께 모여 스터디를 시작하거나 프로젝트를 만들어서 성장하는 즐거움을 함께 누려봐요!
            &#13;&#10;함께하고 싶으신 분들은 언제든지 환영입니다!"
          />
        </SFlexColumnFull>
        {pageType === 'CREATE' && (
          <>
            <SMargin margin="120px 0px 0px 0px" />
            <SFlexColumnFull>
              <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
                내 포지션
              </Txt>
              <Txt fontSize={16} style={{ marginBottom: 20 }}>
                파티 내에서 본인의 포지션을 입력해 주세요.
              </Txt>
              <SFlexRowFull style={{ justifyContent: 'space-between', gap: '20px' }}>
                <Select
                  placeholder="직군"
                  height="m"
                  options={positionList}
                  value={내포지션.직군}
                  onClick={handleSelectChange(set내포지션, '직군')}
                />
                <Select
                  placeholder="직무"
                  height="m"
                  options={내포지션Filtered}
                  value={내포지션.직무}
                  onClick={handleSelectChange(set내포지션, '직무', 내포지션Filtered)}
                />
              </SFlexRowFull>
            </SFlexColumnFull>
          </>
        )}
        <SMargin margin="7.5rem 0px 0px 0px" />
        {pageType === 'MODIFY' && (
          <>
            <SFlexColumnFull>
              <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
                파티 상태
              </Txt>
              <Txt fontSize={16} style={{ marginBottom: 20 }}>
                파티의 진행 상태를 선택해 주세요.
              </Txt>
              <SFlexRowFull style={{ justifyContent: 'space-between' }}>
                {['active', 'archived'].map((item, index) => (
                  <Button
                    key={index}
                    onClick={async e => {
                      const 모집공고 = await fetchGetPartyRecruitmentsList({
                        partyId: Number(partyId),
                        sort: 'createdAt',
                        order: 'DESC',
                        status: 'active',
                      });
                      if (모집공고.length != 0 && item === 'archived') {
                        openModal({
                          children: (
                            <ConfirmModal
                              modalTitle="파티 종료 불가"
                              modalContents={
                                <>
                                  파티 모집글이 있으면 파티를 종료할 수 없어요.
                                  <br />
                                  모집글을 먼저 삭제해주세요.
                                </>
                              }
                              submitBtnTxt="확인"
                            />
                          ),
                          onCancel: () => {
                            closeModal();
                          },
                          onSubmit: async () => {
                            closeModal();
                          },
                        });
                      } else {
                        set파티상태(item);
                      }
                    }}
                    height="base"
                    backgroudColor={파티상태 === item ? 'greenLight200' : 'white'}
                    borderColor={파티상태 === item ? 'transparent' : 'grey200'}
                    radius="base"
                    shadow="shadow1"
                  >
                    {item === 'active' ? '진행중' : '파티종료'}
                  </Button>
                ))}
              </SFlexRowFull>
            </SFlexColumnFull>
            <SMargin margin="7.5rem 0px 0px 0px" />
            <Button
              style={{ width: '100%', marginBottom: 60 }}
              disabled={buttonDisabled}
              height="l"
              backgroudColor="primaryGreen"
              radius="base"
              shadow="shadow1"
              onClick={e => handleCreatePartyButton(e)}
            >
              <Txt fontWeight="bold" fontColor={buttonDisabled ? 'grey400' : 'black'}>
                수정 완료
              </Txt>
            </Button>
            <Txt
              fontColor="failRed"
              fontSize={16}
              fontWeight="normal"
              textDecoration="underline"
              style={{ cursor: 'pointer' }}
              onClick={onClickDeleteParty}
            >
              파티 삭제하기
            </Txt>
            <SMargin margin="7.5rem 0px 0px 0px" />
          </>
        )}
        {pageType === 'CREATE' && (
          <SFlexRowFull style={{ justifyContent: 'space-between' }}>
            <Button
              style={{ marginBottom: 60 }}
              height="l"
              width="base"
              backgroudColor="white"
              borderColor="primaryGreen"
              radius="base"
              shadow="shadow1"
              onClick={onClickCancel}
            >
              <Txt fontWeight="bold">취소</Txt>
            </Button>
            <Button
              style={{ marginBottom: 60 }}
              disabled={buttonDisabled}
              height="l"
              width="base"
              backgroudColor="primaryGreen"
              radius="base"
              shadow="shadow1"
              onClick={e => handleCreatePartyButton(e)}
            >
              <Txt fontWeight="bold" fontColor={buttonDisabled ? 'grey400' : 'black'}>
                생성하기
              </Txt>
            </Button>
          </SFlexRowFull>
        )}
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
