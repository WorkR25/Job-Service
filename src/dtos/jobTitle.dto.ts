export type UpdateJobTitleDto= {
    id: number;
    title: string;
    userId: number;
    jwtToken: string;
}

export type DeleteJobTitleDto={
    id: number;
    userId: number;
    jwtToken: string;
}

export type GetJobTitleDto={
    title: string;
    userId: number;
    jwtToken: string;
}

export type CreateJobTitleDto={
    title: string;  
    userId: number;
    jwtToken: string;
}