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
  image: string;
  createdAt: string;
  userPersonalities: UserPersonality[];
  userCareers: UserCareer[];
  userLocations: UserLocation[];
}

export interface UserPersonality {
  question: string;
  options: string[];
}

export interface UserCareer {
  id: number;
  years: number;
  careerType: string; // 'primary', 'secondary'
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
  province: string;
  city: string;
}
/** [GET] /users/me type end */

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
