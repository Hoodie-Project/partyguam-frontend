export interface PartyRecruitmentsResponse {
  total: number;
  partyRecruitments: {
    id: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    partyId: number;
    positionId: number;
    recruitingCount: number;
    recruitedCount: number;
    content: string;
    party: {
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
