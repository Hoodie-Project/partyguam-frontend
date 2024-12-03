type Menu = {
  대메뉴: string;
  소메뉴: {
    label: string;
    route: string;
  }[];
};

export const MYPAGE_MENU = () => {
  return [
    {
      대메뉴: '프로필',
      소메뉴: [
        { label: '프로필 편집', route: `/my/profile` },
        { label: '계정 설정', route: `/my/account` },
      ],
    },
    {
      대메뉴: '활동',
      소메뉴: [
        { label: '내 파티', route: `/my/party` },
        { label: '지원 목록', route: `/my/apply` },
      ],
    },
  ] as Menu[];
};
