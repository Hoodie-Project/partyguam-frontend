export interface PartyRecruitmentsResponse {
  total: number;
  partyRecruitments: {
    id: number;
    createdAt: string;
    maxParticipants: number;
    currentParticipants: number;
    content: string;
    partyStatus: 'IN_PROGRESS' | 'CLOSED';
    party: {
      id: number;
      title: string;
      image: string;
      completed: boolean; // 모집 완료 여부
      partyType: {
        id: number;
        type: string;
      };
    };
    position: {
      id: number;
      main: string;
      sub: string;
    };
  }[];
}
