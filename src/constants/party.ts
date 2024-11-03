type Menu = {
  대메뉴: string;
  소메뉴: {
    label: string;
    route: string;
  }[];
};

export const PARTY_SETTING_MENU = (partyId?: string) => {
  return [
    {
      대메뉴: '파티 관리',
      소메뉴: [
        { label: '파티 수정', route: `/party/setting/${partyId}` },
        { label: '파티원 관리', route: `/party/setting/partyUsers/${partyId}` },
      ],
    },
    {
      대메뉴: '모집 관리',
      소메뉴: [
        { label: '모집 편집', route: `/party/setting/recruit/${partyId}` },
        { label: '지원자 관리', route: `/party/setting/applicant/${partyId}` },
      ],
    },
  ] as Menu[];
};

// 파티 지원 상태 리턴 (영어 -> 한글)
/**
 * 
 * @param status string ('active', 'approved', 'pending', 'rejected')
 * @returns {
    active: { label: '검토중', color: '#111111' },
    approved: { label: '수락', color: '#11C9A7' },
    pending: { label: '응답대기', color: '#FFAA00' },
    rejected: { label: '거절', color: '#767676' },
  }
 */
export const PARTY_APPLICANTS_STATUS = (status: string) => {
  return {
    active: { label: '검토중', color: '#111111' },
    approved: { label: '수락', color: '#11C9A7' },
    pending: { label: '응답대기', color: '#FFAA00' },
    rejected: { label: '거절', color: '#767676' },
  }[status];
};

export const TRANSFORM_PARTY_APPLICANTS_STATUS = (status: string) => {
  return {
    검토중: 'active',
    수락: 'approved',
    응답대기: 'pending',
    거절: 'rejected',
  }[status];
};
