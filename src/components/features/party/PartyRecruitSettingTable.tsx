import * as React from 'react';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSort } from '@table-library/react-table-library/sort';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';

import { Txt } from '@/components/_atoms';
import PartyRecruitDetail from '@/components/pages/party/recruit/[recruitId]';
import { useModalContext } from '@/contexts/ModalContext';

// Sample Data
const data = {
  nodes: [
    { id: 1, role: '디자이너', job: 'UI/UX', recruitment: '1 / 3', applicants: 2, date: '2024.06.20' },
    { id: 2, role: '기획자', job: 'PM', recruitment: '0 / 2', applicants: 2, date: '2024.06.19' },
    { id: 3, role: '개발자', job: '프론트엔드', recruitment: '0 / 1', applicants: 2, date: '2024.06.18' },
    { id: 4, role: '개발자', job: '백엔드', recruitment: '0 / 1', applicants: 2, date: '2024.06.17' },
  ],
};

type Props = {
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
};

function PartyRecruitSettingTable({ selectedRows, setSelectedRows }: Props) {
  const { openModal, closeModal } = useModalContext();
  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        DATE: array => array.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      },
    },
  );

  const getIcon = (sortKey: string) => {
    if (sort.state.sortKey === sortKey && sort.state.reverse) {
      return <ArrowDownwardIcon fontSize="small" />;
    }

    if (sort.state.sortKey === sortKey && !sort.state.reverse) {
      return <ArrowUpwardIcon fontSize="small" />;
    }

    return <ArrowUpwardIcon fontSize="small" />;
  };

  // 정렬 바뀔때
  function onSortChange(action, state) {
    console.log(action, state);
  }

  // 전체 선택/해제 기능
  const handleSelectAll = () => {
    if (selectedRows.length === data.nodes.length) {
      setSelectedRows([]); // 모두 해제
    } else {
      setSelectedRows(data.nodes.map(node => node.id)); // 모두 선택
    }
  };

  // 개별 행 선택 기능
  const handleRowSelect = (id: number) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(id) ? prevSelected.filter(rowId => rowId !== id) : [...prevSelected, id],
    );
  };

  // 미
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
        // 삭제 api
        closeModal();
      },
    });
  };

  return (
    <Table data={data} sort={sort} style={{ width: '100%' }}>
      {tableList => (
        <>
          <Header>
            <HeaderRow>
              <StyledHeaderCell
                style={{
                  borderRadius: '20px 0px 0px 0px',
                }}
              >
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
                onClick={() => sort.fns.onToggleSort({ sortKey: 'DATE' })}
                style={{ cursor: 'pointer' }}
              >
                <Txt
                  fontWeight="semibold"
                  fontSize={14}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  등록일 {getIcon('DATE')}
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
            {tableList.map(item => (
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
                    {item.role}
                  </Txt>
                </StyledCell>
                <StyledCell>
                  <Txt fontWeight="normal" fontSize={14}>
                    {item.job}
                  </Txt>
                </StyledCell>
                <StyledCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="failRed">
                    {item.recruitment}
                  </Txt>
                </StyledCell>
                <StyledCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="greenDark100">
                    {item.applicants}
                  </Txt>
                </StyledCell>
                <StyledCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey500">
                    {item.date}
                  </Txt>
                </StyledCell>
                <StyledCell>
                  <CircleButton onClick={() => onClick미리보기Button(item.id)}>미리보기</CircleButton>
                </StyledCell>
                <StyledCell>
                  <CircleButton>수정하기</CircleButton>
                </StyledCell>
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
  );
}

// 정렬 불가능한 헤더
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
