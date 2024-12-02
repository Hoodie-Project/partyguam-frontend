// [GET] 파티 홈 - 홈탭
export interface PartyHomeResponse {
  id: number;
  partyType: PartyType;
  partyUser: {
    id: number;
    nickname: string;
    image: string;
  }[];
  tag: string;
  title: string;
  content: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartyType {
  id: number;
  type: string;
}

// [GET] 파티 홈 - 파티원탭

export interface PartyUserResponse {
  partyUser: {
    authority: string;
    position: Position;
    user: User;
  }[];
  partyAdmin: {
    authority: string;
    position: Position;
    user: User;
  }[];
}

export interface PartyUser {
  authority: 'master' | 'deputy' | 'member';
  position: Position;
  user: User;
}

export interface Position {
  id: number;
  main: string;
  sub: string;
}

export interface User {
  id: number;
  nickname: string;
  image: any;
  userCareers: UserCareer[];
}

export interface UserCareer {
  positionId: number;
  years: number;
}

// [GET] 파티 공고 상세 조회
export interface PartyRecruitDetailResponse {
  party: {
    title: string;
    image: string;
    tag: string;
    partyType: {
      type: string;
    };
  };
  position: {
    main: string;
    sub: string;
  };
  content: string;
  recruitingCount: number;
  recruitedCount: number;
  applicationCount: number;
  createdAt: string;
}

// [GET] 파티 공고 리스트 전체 조회
export interface PartyRecruitment {
  id: number; // 모집 ID
  position: {
    main: string; // 직군 (예: "기획", "디자이너" 등)
    sub: string; // 직무 (예: "UI/UX 기획자")
  };
  content: string; // 모집 설명
  recruitingCount: number; // 모집 인원
  recruitedCount: number; // 이미 모집된 인원
  applicationCount: number; // 지원자 수
  createdAt: string; // 생성일
}

export type PartyRecruitmentListResponse = PartyRecruitment[];

// [GET] 관리자-파티원 목록 조회
export interface PartyUserListByAdminResponse {
  totalPartyUserCount: number;
  total: number;
  partyUser: PartyUserByAdmin[];
}

export interface PartyUserByAdmin {
  createdAt: string; // 참여 날짜
  authority: string; // 직책
  position: {
    main: string; // 직군
    sub: string; // 직무
  };
  user: {
    id: number;
    nickname: string;
    image?: string | null;
  };
}

// [GET] 파티 포지션별 모집 공고 지원자
export interface PartyApplicationData {
  total: number;
  partyApplicationUser: PartyApplicationUser[];
}

export interface PartyApplicationUser {
  id: number;
  message: string;
  status: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    image?: string | null;
  };
}
