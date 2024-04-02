'use client';

import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Txt } from '@/components/atoms';

/**
 *
 * NOTE. 추후 확장 가능하게 바꿔야함
 */
export default function Dropdown() {
  return (
    <DropdownContainer>
      <Txt fontSize={20} onClick={() => {}}>
        상태창
      </Txt>
      <ExpandMoreIcon />
    </DropdownContainer>
  );
}

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
