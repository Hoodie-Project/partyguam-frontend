export interface User {
  id: number;
  email: string;
  nickname: string;
  birth: string;
  gender: string;
  image: string;
  createdAt: string;
}

/** detailProfile start */
export interface UserLocationResponse {
  id: number;
  userId: number;
  locationId: number;
}

export interface Position {
  id: number;
  main: string;
  sub: string;
}

export interface PositionPerCategory {
  id: number;
  label: string;
}

export interface UserPositionResponse {
  id: number;
  userId: number;
  positionId: number;
  years: number;
  careerType: 'primary' | 'secondary';
}

export interface PersonalityOption {
  id: number;
  personalityQuestionId: number;
  content: string;
}

export interface PersonalityQuestion {
  id: number;
  content: string;
  responseCount: number;
  personalityOptions: PersonalityOption[];
}

export interface SelectedPersonality {
  personalityQuestionId: number;
  personalityOptionId: number[];
}

export interface UserPersonalityResponse {
  id: number;
  userId: number;
  personalityOptionId: number;
}
/** detailProfile End */
