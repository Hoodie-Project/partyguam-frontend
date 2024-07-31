import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from '@emotion/styled';

import { Portal } from '@/components/_atoms';
import { palette } from '@/styles';

type Menu = {
  대메뉴: string;
  소메뉴: {
    label: string;
    route: string;
  }[];
};

type OwnProps = {
  menu: Menu[];
};

type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export default function FloatingMenu({ menu, ...divAttributes }: Props) {
  const pathname = usePathname();

  return (
    <Portal>
      <MenuContainer {...divAttributes}>
        {menu.map((item, index) => (
          <MenuItem key={index}>
            <MenuTitle>{item.대메뉴}</MenuTitle>
            <SubMenuList>
              {item.소메뉴.map((subItem, subIndex) => (
                <SubMenuItem key={subIndex} active={pathname === subItem.route}>
                  <Link href={subItem.route}>{subItem.label}</Link>
                </SubMenuItem>
              ))}
            </SubMenuList>
          </MenuItem>
        ))}
      </MenuContainer>
    </Portal>
  );
}

const MenuContainer = styled.div`
  position: fixed;
  top: 182px;
  left: 180px;
  z-index: 20;
`;

const MenuItem = styled.div`
  margin-bottom: 42px;
`;

const MenuTitle = styled.div`
  padding-top: 14px;
  padding-bottom: 19px;
  font-weight: bold;
`;

const SubMenuList = styled.ul`
  list-style: none;
  margin: 0;
`;

const SubMenuItem = styled.li<{ active: boolean }>`
  padding-bottom: 10px;
  cursor: pointer;
  font-weight: bold;
  color: ${({ active }) => (active ? palette.greenDark100 : palette.grey400)};
  &:hover {
    color: ${({ active }) => (active ? palette.greenDark100 : palette.grey600)};
  }
`;
