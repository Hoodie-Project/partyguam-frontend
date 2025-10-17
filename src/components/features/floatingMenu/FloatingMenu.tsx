'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { useModalContext } from '@/contexts/ModalContext';
import { ConfirmModal } from '@/components/features';
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
  isDirty?: boolean;
};

type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export default function FloatingMenu({ menu, isDirty = false, ...divAttributes }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();

  const handleClick = (e: React.MouseEvent, route: string) => {
    if (isDirty) {
      openModal({
        children: (
          <ConfirmModal
            modalTitle="페이지 이동"
            modalContents={
              <>
                입력한 내용이 저장되지 않았습니다.
                <br />
                이동하시겠습니까?
              </>
            }
            cancelBtnTxt="취소"
            submitBtnTxt="이동"
          />
        ),
        onCancel: () => {
          closeModal();
        },
        onSubmit: () => {
          console.log('모달 submit 이동 시도', route);
          //router.push(route); 
          window.location.assign(route);
          closeModal();
        },
      });
    } else {
      router.push(route); 
    }
  };

  return (
    <Portal>
      <MenuContainer className="custom-side-menu" {...divAttributes}>
        {menu.map((item, index) => (
          <MenuItem key={index}>
            <MenuTitle style={{ lineHeight: '140%' }}>{item.대메뉴}</MenuTitle>
            <SubMenuList>
              {item.소메뉴.map((subItem, subIndex) => {
                const active = pathname === subItem.route;
                return (
                  <SubMenuItem key={subIndex} active={active}> 
                    <Link
                      href={subItem.route}
                      onClick={(e) => {
                        if (isDirty) {
                          e.preventDefault();
                          handleClick(e, subItem.route);
                        }
                      }}
                      style={{ lineHeight: '140%' }}
                    >
                      {subItem.label}
                    </Link>
                  </SubMenuItem>
                );
              })}
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
  left: 280px;
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
