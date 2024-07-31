export const PARTY_MODIFY_MENU: {
  대메뉴: string;
  소메뉴: {
    label: string;
    route: string;
  }[];
}[] = [
  {
    대메뉴: '파티 관리',
    소메뉴: [
      { label: '파티 수정', route: '/party/modify' },
      { label: '파티원 관리', route: '/' },
    ],
  },
  {
    대메뉴: '모집 관리',
    소메뉴: [
      { label: '모집 수정', route: '/' },
      { label: '지원자 관리', route: '/' },
    ],
  },
];
