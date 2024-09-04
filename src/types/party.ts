export interface PartyHomeResponse {
  id: number;
  partyType: PartyType;
  partyUser: PartyUser[];
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

export interface PartyUser {
  id: number;
  nickname: string;
  image: string;
}
