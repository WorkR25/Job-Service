export type CreateExperienceLevelDto= {
  name: string;
  minYears: number;
  maxYears: number;
  userId: number;
  jwtToken: string;
}

export type UpdateExperienceLevelDto= {
  id: number;
  name?: string;
  minYears?: number;
  maxYears?: number;
  userId: number;
  jwtToken: string;
}

export type DeleteExperienceLevelDto= {
  id: number;
  userId: number;
  jwtToken: string;
}

export type GetExperienceLevelDto= {
  name: string;
  userId: number;
  jwtToken: string;
}

export type GetExperienceLevelByIdDto= {
    id: number;
    userId: number;
    jwtToken: string;
}