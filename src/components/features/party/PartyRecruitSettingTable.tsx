import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';

import { fetchGetPartyRecruitmentsList } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import PartyRecruitDetail from '@/components/pages/party/recruit/[recruitId]';
import { useModalContext } from '@/contexts/ModalContext';
import type { PartyRecruitment, PartyRecruitmentListResponse } from '@/types/party';
import { formatDate } from '@/utils/date';

type Props = {
  partyId: number;

  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  partyRecruitList: PartyRecruitmentListResponse;
  setPartyRecruitList: React.Dispatch<React.SetStateAction<PartyRecruitmentListResponse>>;
};

function PartyRecruitSettingTable({
  partyId,
  selectedRows,
  setSelectedRows,
  partyRecruitList,
  setPartyRecruitList,
}: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const { openModal, closeModal } = useModalContext();

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const requestParams = {
          partyId,
          sort: 'createdAt',
          order,
          status: 'active',
        };

        const data = await fetchGetPartyRecruitmentsList(requestParams);
        setPartyRecruitList(data);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
      }
    };

    fetchRecruitments();
  }, [partyId, order]);

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
            style={{ position: 'absolute', top: '32px', right: '32px' }}
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

  return (
    <>
      <Table data={data} style={{ width: '100%', zIndex: 0, marginBottom: 'calc(3.125rem + 3.5rem)' }}>
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
                    등록일 {getIcon()}
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    미리보기
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell style={{ borderRadius: '0px 20px 0px 0px' }}>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    수정하기
                  </Txt>
                </StyledHeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item: TablePartyRecruitment) => (
                <Row item={item} key={item.id}>
                  <StyledCell>
                    <CenteredCheckbox>
                      <CustomCheckbox
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                      />
                    </CenteredCheckbox>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14}>
                      {item.position.main}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14}>
                      {item.position.sub}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14} fontColor="failRed">
                      {item.recruitedCount} / {item.recruitingCount}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14} fontColor="greenDark100">
                      {item.applicationCount}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14} fontColor="grey500">
                      {formatDate(item.createdAt)}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <CircleButton onClick={() => onClick미리보기Button(item.id)}>미리보기</CircleButton>
                  </StyledCell>
                  <StyledCell>
                    <CircleButton
                      onClick={() =>
                        router.push(
                          `/party/setting/recruit/edit?type=MODIFY&partyId=${partyId}&recruitId=${item.id}&main=${item.position.main}&sub=${item.position.sub}`,
                        )
                      }
                    >
                      수정하기
                    </CircleButton>
                  </StyledCell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
      {partyRecruitList.length === 0 && (
        <Txt fontSize={16} fontColor="grey400" style={{ width: '100%', textAlign: 'center', marginTop: '138px' }}>
          모집 공고가 없어요
        </Txt>
      )}
    </>
  );
}

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
  height: 800px;
  padding: 32px 90px;
  overflow-y: auto;
`;

export default PartyRecruitSettingTable;
