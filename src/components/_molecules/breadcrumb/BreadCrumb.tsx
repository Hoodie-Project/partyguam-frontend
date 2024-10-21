'use client';
import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

type Props = {
  contents: string[];
};

function BreadCrumb({ contents }: Props) {
  return (
    <BreadCrumbContainer>
      {contents.map((item, index) => (
        <Fragment key={index}>
          <Crumb isFirst={index === 0} isLast={contents.length - 1 === index}>
            {item}
          </Crumb>
          {index < contents.length - 1 && (
            <KeyboardArrowRightRoundedIcon
              sx={{
                width: '16px',
                color: '#767676',
              }}
            />
          )}
        </Fragment>
      ))}
    </BreadCrumbContainer>
  );
}

export default BreadCrumb;

const NaviHeight = 84;

const BreadCrumbContainer = styled.div`
  position: fixed;
  top: calc(20px + ${NaviHeight}px);
  left: 280px;
  z-index: 20;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
`;

const Crumb = styled.span<{ isFirst: boolean; isLast: boolean }>`
  font-size: 14px;
  font-weight: ${({ isLast }) => (isLast ? 'bold' : 'normal')};
  color: ${({ isLast }) => (isLast ? '#111111' : '#767676')};
  margin-left: ${({ isFirst }) => (isFirst ? '0px' : '8px')};
`;
