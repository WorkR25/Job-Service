export type City= {
    id: number;
    name: string;
    stateId: number;
}

export type GetCityResponse = {
    success: boolean;
    message: string;
    data: City;
    error: Record<string, null>;
};