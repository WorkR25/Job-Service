export type GetJobDetailsDto= {
    id: number;
}

export type GetAllJobDto= {
    userId: number;
    jwtToken: string;
}

export type GetAllJobByQueryDto={
    userId: number;
    jwtToken: string;
    title_id?: number;
    employment_type_id?: number;
    experience_level_id?: number;
    salary_min?: number;
    salary_max?: number;
    recuiter_id?: number;
    company_id?: number;
    location_id?: number;
    apply_link?: string;
}

export type CreateJobDto= {
    userId: number;
    jwtToken: string;
    title_id: number;
    employment_type_id: number;
    experience_level_id: number;
    salary_min: number;
    salary_max: number;
    recruiter_id: number;
    company_id: number;
    location_id: number;
    apply_link: string;
    skillIds: number[];
    description: string;
}

export type DeleteJobDto= {
    userId: number;
    jwtToken: string;
    id: number;
}

export type UpdateJobDto= {
    userId: number;
    jwtToken: string;
    id: number;
    title_id?: number;
    employment_type_id?: number;
    experience_level_id?: number;
    salary_min?: number;
    salary_max?: number;
    recuiter_id?: number;
    company_id?: number;
    location_id?: number;
    apply_link?: string;
    skillIds: number[];
}

export type GetAllJobsPagination= {
    userId: number;
    jwtToken: string;
    page: number;
    limit: number;
}