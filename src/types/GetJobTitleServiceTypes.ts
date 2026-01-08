export type Role = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};

export type GetRolesResponse = {
    success: boolean;
    message: string;
    data: Role[];
    error: Record<string, null>;
};

export type GetRolesResponseGeneric = {
    success: boolean;
    message: string;
    data: string[];
    error: Record<string, null>;
};