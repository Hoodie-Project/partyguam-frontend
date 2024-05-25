export interface User {
  id: number;
  email: string;
  nickname: string;
  birth: string;
  gender: string;
  image: string;
  createdAt: string;
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
