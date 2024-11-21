'use client';
import { usePathname, useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { Txt } from '@/components/_atoms';

const menuList = [
  { id: 0, label: '파티', route: '/home/party' },
  { id: 1, label: '모집공고', route: '/home/recruitment' },
];

export default function Menus() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <MenuContainer>
      {menuList.map(item => (
        <Txt
          key={item.id}
          fontSize={20}
          onClick={() => {
            router.push(item.route);
          }}
          fontWeight={pathname === item.route ? 'bold' : 'normal'}
        >
          {item.label}
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
