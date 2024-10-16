'use client';
import React from 'react';
import styled from '@emotion/styled';

export type TableColumn<T> = {
  label: string;
  accessor: keyof T;
  sortable?: boolean;
  width?: string;
  height?: string;
  render?: (row: T) => React.ReactNode; // 셀의 커스텀 렌더링을 위한 함수
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  onSort?: (column: keyof T) => void;
  supportsCheckbox?: boolean; // 체크박스 사용 여부
  selectedRows: number[]; // 선택된 행의 ID 리스트
  onSelect: (id: number) => void; // 개별 선택 이벤트 핸들러
  onSelectAll: () => void; // 전체 선택 이벤트 핸들러
  rowCheckbox?: (row: T) => boolean; // 특정 row에 체크박스 숨김 여부 결정
};

function Table<T extends { id: number }>({
  columns,
  data,
  onSort,
  supportsCheckbox = false,
  selectedRows,
  onSelect,
  onSelectAll,
  rowCheckbox,
}: TableProps<T>) {
  return (
    <TableContainer>
      <thead>
        <tr>
          {supportsCheckbox && (
            <th>
              <input
                type="checkbox"
                checked={data.every(row => selectedRows.includes(row.id))}
                onChange={onSelectAll}
              />
            </th>
          )}
          {columns.map((column, index) => (
            <TableHeader key={index} width={column.width} onClick={() => column.sortable && onSort?.(column.accessor)}>
              {column.label}
            </TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {supportsCheckbox && (
              <td>
                {(!rowCheckbox || rowCheckbox(row)) && (
                  <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => onSelect(row.id)} />
                )}
              </td>
            )}
            {columns.map((column, index) => (
              <TableCell key={index} width={column.width} height={column.height}>
                {column.render ? column.render(row) : String(row[column.accessor])}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
}

const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th<{ width?: string }>`
  cursor: pointer;
  padding: 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  text-align: left;
  width: ${({ width }) => width || 'auto'};

  &:hover {
    background-color: #e0e0e0;
  }
`;

const TableCell = styled.td<{ width?: string; height?: string }>`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
`;

export default Table;
