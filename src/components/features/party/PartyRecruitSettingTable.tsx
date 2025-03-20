/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';

import {
  fetchCompletePartyRecruitment,
  fetchDeletePartyRecruitmentOnly,
  fetchGetPartyRecruitmentsList,
} from '@/apis/party';
import KebabMenu from '@/assets/icon/kebab-menu.svg';
import { Txt } from '@/components/_atoms';
import { DropdownV2 } from '@/components/_molecules/dropdown';
import PartyRecruitDetail from '@/components/pages/party/recruit/[recruitId]';
import { useModalContext } from '@/contexts/ModalContext';
import type { PartyRecruitment, PartyRecruitmentListResponse } from '@/types/party';
import { formatDate } from '@/utils/date';

import ConfirmModal from '../comfirmModal';

type Props = {
  status: 'active' | 'completed';
  partyId: number;

  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  partyRecruitList: PartyRecruitmentListResponse;
  setPartyRecruitList: React.Dispatch<React.SetStateAction<PartyRecruitmentListResponse>>;
};

function PartyRecruitSettingTable({
  status,
  partyId,
  selectedRows,
  setSelectedRows,
  partyRecruitList,
  setPartyRecruitList,
}: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [dropdownVisibleRow, setDropdownVisibleRow] = useState<number | null>(null);
  const { openModal, closeModal } = useModalContext();

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const requestParams = {
          partyId,
          sort: 'createdAt',
          order,
          status: status,
        };

        const data = await fetchGetPartyRecruitmentsList(requestParams);
        setPartyRecruitList(data);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
      }
    };

    fetchRecruitments();
  }, [partyId, order, status, setPartyRecruitList]);

  interface TablePartyRecruitment extends PartyRecruitment {
    id: number;
  }

  const partyRecruitListWithId: TablePartyRecruitment[] = partyRecruitList.map(item => ({
    ...item,
    id: item.id,
  }));

  const data = { nodes: partyRecruitListWithId };

  const getIcon = () => {
    if (order === 'DESC') {
      return <ArrowDownwardIcon fontSize="small" />;
    }

    if (order === 'ASC') {
      return <ArrowUpwardIcon fontSize="small" />;
    }
    return <ArrowUpwardIcon fontSize="small" />;
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.nodes.length) {
      setSelectedRows([]); // 모두 해제
    } else {
      setSelectedRows(data.nodes.map(node => node.id)); // 모두 선택
    }
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(id) ? prevSelected.filter(rowId => rowId !== id) : [...prevSelected, id],
    );
  };

  const onClick미리보기Button = (recruitId: number) => {
    openModal({
      children: (
        <PreviewModalContainer>
          <CloseRoundedIcon
            style={{ position: 'fixed', top: '32px', right: '32px' }}
            onClick={() => {
              closeModal();
            }}
          />
          <PartyRecruitDetail recruitId={recruitId.toString()} isReadOnly={true} />
        </PreviewModalContainer>
      ),
      onCancel: () => {
        closeModal();
      },
      onSubmit: () => {
        closeModal();
      },
    });
  };

  const theme = useTheme({
    Table: `
    padding-bottom: 40px;
    z-index: 0;
    scroll: scroll;
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE, Edge */    `,
  });

  return (
    <>
      <Table theme={theme} data={data} style={{ width: '100%', marginBottom: 'calc(3.125rem + 3.5rem)' }}>
        {(tableList: TablePartyRecruitment[]) => (
          <>
            <Header>
              <HeaderRow>
                <StyledHeaderCell style={{ borderRadius: '20px 0px 0px 0px' }}>
                  <CenteredCheckbox>
                    <CustomCheckbox
                      type="checkbox"
                      checked={selectedRows.length === data.nodes.length}
                      onChange={handleSelectAll}
                    />
                  </CenteredCheckbox>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    직군
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    직무
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    모집인원
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    지원자
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell
                  onClick={() => setOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC'))}
                  style={{ cursor: 'pointer' }}
                >
                  <Txt
                    fontWeight="semibold"
                    fontSize={14}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    모집일 {getIcon()}
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    미리보기
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell style={{ borderRadius: '0px 20px 0px 0px' }} />
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item: TablePartyRecruitment) => (
                <Row item={item} key={item.id} style={{ cursor: 'pointer' }}>
                  <StyledCell>
                    <CenteredCheckbox>
                      <CustomCheckbox
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                      />
                    </CenteredCheckbox>
                  </StyledCell>
                  <StyledCell
                    onClick={() => {
                      router.push(
                        `/party/setting/recruit/edit?type=MODIFY&partyId=${partyId}&recruitId=${item.id}&main=${item.position.main}&sub=${item.position.sub}`,
                      );
                    }}
                  >
                    <Txt fontWeight="normal" fontSize={14}>
                      {item.position.main}
                    </Txt>
                  </StyledCell>
                  <StyledCell
                    onClick={() => {
                      router.push(
                        `/party/setting/recruit/edit?type=MODIFY&partyId=${partyId}&recruitId=${item.id}&main=${item.position.main}&sub=${item.position.sub}`,
                      );
                    }}
                  >
                    <Txt fontWeight="normal" fontSize={14}>
                      {item.position.sub}
                    </Txt>
                  </StyledCell>
                  <StyledCell
                    onClick={() => {
                      router.push(
                        `/party/setting/recruit/edit?type=MODIFY&partyId=${partyId}&recruitId=${item.id}&main=${item.position.main}&sub=${item.position.sub}`,
                      );
                    }}
                  >
                    <Txt fontWeight="normal" fontSize={14} fontColor="failRed">
                      {item.recruitedCount} / {item.recruitingCount}
                    </Txt>
                  </StyledCell>
                  <StyledCell
                    onClick={() => {
                      router.push(
                        `/party/setting/recruit/edit?type=MODIFY&partyId=${partyId}&recruitId=${item.id}&main=${item.position.main}&sub=${item.position.sub}`,
                      );
                    }}
                  >
                    <Txt fontWeight="normal" fontSize={14} fontColor="greenDark100">
                      {item.applicationCount}
                    </Txt>
                  </StyledCell>
                  <StyledCell
                    onClick={() => {
                      router.push(
                        `/party/setting/recruit/edit?type=MODIFY&partyId=${partyId}&recruitId=${item.id}&main=${item.position.main}&sub=${item.position.sub}`,
                      );
                    }}
                  >
                    <Txt fontWeight="normal" fontSize={14} fontColor="grey500">
                      {formatDate(item.createdAt)}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <CircleButton onClick={() => onClick미리보기Button(item.id)}>미리보기</CircleButton>
                  </StyledCell>
                  <StyledCell
                    onClick={e => {
                      e.stopPropagation();
                      setDropdownVisibleRow(prev => (prev === item.id ? null : item.id));
                    }}
                    style={{ position: 'relative' }}
                  >
                    <KebabMenu />
                    {dropdownVisibleRow === item.id && (
                      <DropdownV2
                        isVisible={true}
                        menuList={
                          status === 'active'
                            ? [
                              {
                                label: '마감하기',
                                onClick: () => {
                                  openModal({
                                    children: (
                                      <ConfirmModal
                                        modalTitle="모집공고 마감"
                                        modalContents={
                                          <>
                                            지원자에게 알림이 전송돼요.
                                            <br />
                                            마감 후에는 수정할 수 없어요.
                                            <br />
                                            정말로 모집공고를 마감하시나요?
                                          </>
                                        }
                                        cancelBtnTxt="닫기"
                                        submitBtnTxt="마감하기"
                                      />
                                    ),
                                    onCancel: () => {
                                      closeModal();
                                    },
                                    onSubmit: async () => {
                                      await fetchCompletePartyRecruitment({
                                        partyId: partyId,
                                        partyRecruitmentId: item.id,
                                      });
                                      closeModal();
                                      window.location.reload();
                                    },
                                  });
                                },
                              },
                            ]
                            : [
                              {
                                label: (
                                  <Txt fontSize={14} fontColor="failRed">
                                    삭제하기
                                  </Txt>
                                ),
                                onClick: () => {
                                  openModal({
                                    children: (
                                      <ConfirmModal
                                        modalTitle="모집공고 삭제"
                                        modalContents={
                                          <>
                                            지원자에게 모집 삭제 알림이 전송돼요. <br />
                                            정말로 모집을 삭제하시나요?
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
                                      await fetchDeletePartyRecruitmentOnly({
                                        partyId: partyId,
                                        partyRecruitmentId: item.id,
                                      });
                                      closeModal();
                                      window.location.reload();
                                    },
                                  });
                                },
                              },
                            ]
                        }
                        positionStyle={{ position: 'absolute', top: '75px', right: '35px' }}
                      />
                    )}
                  </StyledCell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
      {partyRecruitList.length === 0 && (
        <EmptyState>
          <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
          <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
            모집 공고가 없어요.
          </Txt>
        </EmptyState>
      )}
    </>
  );
}

const EmptyState = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #767676; 
`;

const StyledHeaderCell = styled(HeaderCell)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f5;
  height: 60px;
  padding: 10px;
  border-bottom: 1px solid #d4d4d4;
  text-align: center;
`;

const StyledCell = styled(Cell)`
  padding: 10px;
  border-bottom: 1px solid #f1f1f5;
  text-align: center;
  height: 100px;
`;

const CenteredCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const CustomCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid #999999;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  background-color: white;

  &:checked {
    background-color: #11c9a7;
    border-color: #11c9a7;
  }

  &:checked::before {
    content: '';
    position: absolute;
    top: 1.5px;
    left: 5.5px;
    width: 7px;
    height: 11px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const CircleButton = styled.button`
  background-color: white;
  border: 1px solid #e5e5ec;
  border-radius: 999px;
  padding: 7.5px 12px;
  color: #767676;
  font-size: 12px;
`;

const PreviewModalContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: 32px;
  width: 1000px;
  padding: 84px 90px;
  height: 800px;
  overflow-y: scroll;
  overflow-x: hidden;
  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50px;
  }
`;

export default PartyRecruitSettingTable;
