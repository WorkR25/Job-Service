export type CreateEmploymentTypeDto= {
    userId: number;
    jwtToken: string;
    name: string;
    description?: string;
}

export type DeleteEmplymentTypeDto= {
    userId: number;
    jwtToken: string;
    id: number;
}

export type GetEmploymentType= {
    userId: number;
    jwtToken: string;
}

export type UpdateEmploymentTypeDto= {
    userId: number;
    jwtToken: string;
    id: number;
    name?: string;
    description?: string;
}