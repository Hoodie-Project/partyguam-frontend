export interface PartyRecruitmentsResponse {
  total: number;
  partyRecruitments: {
    id: number;
    createdAt: string;
    recruitingCount: number;
    recruitedCount: number;
    content: string;
    party: {
      id: number;
      title: string;
      image: string;
      status: string;
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
