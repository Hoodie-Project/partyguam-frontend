import styled from '@emotion/styled';

import { Txt } from '@/components/atoms';
/**
 * NOTE. 추후 확장 가능하게 변경
 */

const menuList = ['파티', '길드'];

export default function Menus() {
  return (
    <MenuContainer>
      {menuList.map((item, index) => (
        <Txt key={index} fontSize={20} onClick={() => {}}>
          {item}
        </Txt>
      ))}
    </MenuContainer>
  );
}

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 45px;
`;
