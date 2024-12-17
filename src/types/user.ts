/** [GET] /users/me type start */
export interface UsersMeResponse {
  email: string;
  nickname: string;
  birth: string;
  birthVisible: boolean;
  gender: string;
  genderVisible: boolean;
  portfolioTitle: string;
  portfolio: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  userPersonalities: UserPersonality[];
  userCareers: UserCareer[];
  userLocations: UserLocation[];
}

export interface UserPersonality {
  id: number;
  personalityOption: PersonalityOption;
}

export interface PersonalityOption {
  id: number;
  content: string;
  personalityQuestion: PersonalityQuestion;
}

export interface PersonalityQuestion {
  id: number;
  content: string;
  responseCount: number;
  personalityOptions: {
    id: number;
    personalityQuestionId: number;
    content: string;
  }[];
}

export interface UserCareer {
  id: number;
  years: number;
  careerType: string; //'primary' | 'secondary';
  position: UserPosition;
}

export interface UserPosition {
  main: string;
  sub: string;
}

export interface UserLocation {
  id: number;
  location: Location;
}

export interface Location {
  id: number;
  province: string;
  city: string;
}
/** [GET] /users/me type end */

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

export interface SelectedPersonality {
  personalityQuestionId: number;
  personalityOptionId: number[];
}

export interface UserPositionResponse {
  id: number;
  userId: number;
  positionId: number;
  years: number;
  careerType: 'primary' | 'secondary';
}
/** detailProfile End */
