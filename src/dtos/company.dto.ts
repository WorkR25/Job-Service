export type CreateCompanyDto= {
    userId: number;
    jwtToken: string;
    name: string;
    logo: string;
    website: string;
    description: string;
    company_size_id: number;
    industry_id:number;
}


export type UpdateCompanyDto= {
    userId: number;
    jwtToken: string;
    id: number;
    name?: string;
    website?: string;
    logo?: string;
    description?: string;
}

export type DeleteCompanyDto= {
    userId: number;
    jwtToken: string;
    id: number;
}

