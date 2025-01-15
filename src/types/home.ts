export interface PartyRecruitmentsResponse {
  total: number;
  partyRecruitments: {
    id: number;
    createdAt: string;
    recruitingCount: number;
    recruitedCount: number;
    content: string;
    status: string; // 'active' -> 모집중
    party: {
      id: number;
      title: string;
      image: string;
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
