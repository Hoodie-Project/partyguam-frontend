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
  id: number;
  partyUser: PartyUser[];
  title: string;
  content: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartyUser {
  authority: 'master' | 'deputy' | 'member';
  position: Position;
  user: User;
}

export interface Position {
  main: string;
  sub: string;
}

export interface User {
  id: number;
  nickname: string;
  image: any;
}
