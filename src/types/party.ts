export interface SinglePartyResponse {
  id: number;
  partyType: PartyType;
  title: string;
  content: string;
  image: string;
  partyStatus: 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

// [GET] 파티 홈 - 홈탭
export interface PartyHomeResponse {
  id: number;
  partyType: PartyType;
  partyUser: {
    id: number;
    nickname: string;
    image: string;
  }[];
  title: string;
  content: string;
  image: string;
  partyStatus: 'IN_PROGRESS' | 'CLOSED';
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
    authority: 'MASTER' | 'DEPUTY' | 'MEMBER';
    id: number;
    position: Position;
    user: User;
  }[];
  partyAdmin: {
    authority: 'MASTER' | 'DEPUTY' | 'MEMBER';
    id: number;
    position: Position;
    user: User;
  }[];
}

export interface PartyUser {
  authority: 'MASTER' | 'DEPUTY' | 'MEMBER';
  position: Position;
  user: User;
}

export interface Position {
  id: number;
  main: string;
  sub: string;
}

export interface User {
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
    partyStatus: 'IN_PROGRESS' | 'CLOSED'; // 파티 상태
    partyType: {
      type: string;
    };
  };
  position: {
    main: string;
    sub: string;
  };
  completed: boolean; // 모집 완료 여부
  content: string;
  maxParticipants: number;
  currentParticipants: number;
  applicationCount: number;
  createdAt: string;
}

// [GET] 파티 공고 리스트 전체 조회
export interface PartyRecruitment {
  id: number; // 모집 ID
  completed: boolean; // 모집 완료 여부
  position: {
    main: string; // 직군 (예: "기획", "디자이너" 등)
    sub: string; // 직무 (예: "UI/UX 기획자")
  };
  content: string; // 모집 설명
  maxParticipants: number; // 모집 인원
  currentParticipants: number; // 이미 모집된 인원
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
  id: number;
  createdAt: string; // 참여 날짜
  updateAt: string; // 참여 날짜
  authority: 'MASTER' | 'DEPUTY' | 'MEMBER'; // 직책
  position: {
    main: string; // 직군
    sub: string; // 직무
  };
  user: {
    nickname: string;
    image?: string | null;
  };
}

// [GET] 파티 포지션별 모집 공고 지원자
export interface PartyApplicationData {
  total: number;
  applications: PartyApplicationUser[];
}

export interface PartyApplicationUser {
  id: number;
  message: string;
  applicationStatus: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'DECLINED' | 'CLOSED';
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    image?: string | null;
  };
}
