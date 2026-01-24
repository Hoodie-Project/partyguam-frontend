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
 * @param status string ('pending', 'approved', 'processing', 'rejected')
 * @returns {
    pending: { label: '검토중', color: '#111111' },
    approved: { label: '수락', color: '#11C9A7' },
    processing: { label: '응답대기', color: '#FFAA00' },
    rejected: { label: '거절', color: '#767676' },
  }
 */
export const PARTY_APPLICANTS_STATUS = (status: string) => {
  return {
    PENDING: { label: '검토중', color: '#111111' },
    PROCESSING: { label: '응답대기', color: '#FFAA00' },
    APPROVED: { label: '수락', color: '#11C9A7' },
    REJECTED: { label: '거절', color: '#767676' },
    DECLINED: { label: '응답 거절', color: '#767676' },
    CLOSED: { label: '모집 마감', color: '#767676' },
  }[status];
};

export const TRANSFORM_PARTY_APPLICANTS_STATUS = (status: string) => {
  return {
    검토중: 'PENDING',
    수락: 'APPROVED',
    응답대기: 'PROCESSING',
    거절: 'REJECTED',
    '응답 거절': 'DECLINED',
    '모집 마감': 'CLOSED',
  }[status];
};

export const RENDER_PARTY_STATE = (stateTag: string) => {
  return {
    진행중: {
      fontColor: '#016110',
      backgroundColor: '#D5F0E3',
    },
    모집중: {
      fontColor: '#ef6400',
      backgroundColor: '#fff1dc',
    },
    파티종료: {
      fontColor: '#ffffff',
      backgroundColor: '#505050',
    },
  }[stateTag];
};
