'use client';
import React from 'react';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';

import { Txt } from '@/components/_atoms';
import { ProfileImage } from '@/components/_molecules';
import { useModalContext } from '@/contexts/ModalContext';
import type { PartyUserByAdmin, PartyUserListByAdminResponse } from '@/types/party';
import { formatDate } from '@/utils/date';

import PartyUserEditModal from '../partyUserEditModal/PartyUserEditModal';

type Props = {
  partyId: number;
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  order: 'ASC' | 'DESC';
  setOrder: React.Dispatch<React.SetStateAction<'ASC' | 'DESC'>>;
  partyUserList: PartyUserListByAdminResponse | null;
};

function PartyUsersManageTable({ partyId, selectedRows, setSelectedRows, order, setOrder, partyUserList }: Props) {
  const { openModal } = useModalContext();

  interface TablePartyUserManage extends PartyUserByAdmin {
    id: number;
  }

  const partyUserListWithId: TablePartyUserManage[] | undefined = Array.isArray(partyUserList?.partyUser)
    ? partyUserList?.partyUser.map(item => ({
        ...item,
        id: item.id,
      }))
    : [];

  const data = { nodes: partyUserListWithId };

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
    if (data.nodes) {
      if (selectedRows.length === data.nodes.length) {
        setSelectedRows([]); // 모두 해제
      } else {
        setSelectedRows(data.nodes.map(node => node.id)); // 모두 선택
      }
    }
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(id) ? prevSelected.filter(rowId => rowId !== id) : [...prevSelected, id],
    );
  };

  const handleClick수정하기 = (
    user: {
      id: number;
      nickname: string;
      image?: string | null;
    },
    authority: string,
    position: {
      main: string;
      sub: string;
    },
  ) => {
    openModal({
      children: <PartyUserEditModal partyId={partyId} user={user} authority={authority} position={position} />,
    });
  };

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: minmax(0, 1fr) 35% repeat(4, minmax(0, 1fr));
    `,
  });

  return (
    <>
      <Table
        data={data}
        theme={theme}
        layout={{ custom: true }}
        style={{ width: '100%', zIndex: 0, marginBottom: 'calc(3.125rem + 3.5rem)' }}
      >
        {(tableList: TablePartyUserManage[]) => (
          <>
            <Header>
              <HeaderRow>
                <StyledHeaderCell style={{ borderRadius: '20px 0px 0px 0px' }}>
                  <CenteredCheckbox>
                    <CustomCheckbox
                      type="checkbox"
                      checked={selectedRows.length === data.nodes?.length}
                      onChange={handleSelectAll}
                    />
                  </CenteredCheckbox>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    닉네임
                  </Txt>
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
                <StyledHeaderCell
                  onClick={() => setOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC'))}
                  style={{ cursor: 'pointer' }}
                >
                  <Txt
                    fontWeight="semibold"
                    fontSize={14}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    참여일 {getIcon()}
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
              {tableList.map((item: TablePartyUserManage) => (
                <Row item={item} key={item.id}>
                  <StyledCell>
                    <CenteredCheckbox>
                      {item.authority != 'master' && (
                        <CustomCheckbox
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleRowSelect(item.id)}
                        />
                      )}
                    </CenteredCheckbox>
                  </StyledCell>
                  {/* 닉네임 */}
                  <StyledCell>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '8px',
                      }}
                    >
                      <ProfileImage
                        imageUrl={item.user.image || ''}
                        size={40}
                        authority={item.authority as unknown as 'master' | 'deputy' | 'member'}
                        flagWrapperStyle={{ width: '16px', height: '16px' }}
                        flagIconStyle={{ width: '12px', height: '12px', color: 'white' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
                        <Txt
                          fontWeight="semibold"
                          fontSize={12}
                          fontColor={
                            item.authority === 'master'
                              ? 'greenDark100'
                              : item.authority === 'deputy'
                                ? 'greenDark100'
                                : 'grey500'
                          }
                          style={{ lineHeight: '150%' }}
                        >
                          {item.authority === 'master' ? '파티장' : item.authority === 'deputy' ? '부파티장' : '파티원'}
                        </Txt>
                        <Txt
                          fontWeight="normal"
                          fontSize={14}
                          style={{
                            width: '100%',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.user.nickname}
                        </Txt>
                      </div>
                    </div>
                  </StyledCell>
                  {/* 직군 */}
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14}>
                      {item.position.main}
                    </Txt>
                  </StyledCell>
                  {/* 직무 */}
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14}>
                      {item.position.sub}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14} fontColor="grey500">
                      {formatDate(item.createdAt)}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <CircleButton
                      onClick={() => handleClick수정하기({ id: item.id, ...item.user }, item.authority, item.position)}
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
      {partyUserList?.partyUser.length === 0 && (
        <Txt fontSize={16} fontColor="grey400" style={{ width: '100%', textAlign: 'center', marginTop: '138px' }}>
          해당 파티원이 없어요.
        </Txt>
      )}
    </>
  );
}

export default PartyUsersManageTable;

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
