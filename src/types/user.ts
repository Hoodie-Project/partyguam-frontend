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
export interface Position {
  id: number;
  main: string;
  sub: string;
}

export interface PositionPerCategory {
  id: number;
  label: string;
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
  personalityOption: PersonalityOption[];
}

export interface SelectedPersonality {
  personalityQuestionId: number;
  personalityOptionId: number[];
}
/** detailProfile End */
