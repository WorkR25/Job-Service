import axios from 'axios';

import logger from '../../configs/logger.config';
import { microServiceConfig } from '../../configs/server.config';
import { GetRolesResponse, GetRolesResponseGeneric } from '../../types/GetJobTitleServiceTypes';
import { NotFoundError, UnauthorizedError } from '../errors/app.error';

export const allROLE = {
    ADMIN: 'admin',
    OPERATIONS_ADMIN: 'operations_admin',
} as const;

export type allRole = typeof allROLE[keyof typeof allROLE];

export async function isAuthorized(userId: number, jwtToken: string){
    let userRoles;
    try{
        userRoles = await axios.get<GetRolesResponse>(
            `${microServiceConfig.USER_SERVICE_URL}role/${userId}`,{
                headers:{
                    Authorization: jwtToken
                }
            }
        );
    }catch(error){
        logger.error(error);
        throw new UnauthorizedError('User not authorized');
    }
            
    let roleNames: string[] = [];
    
    if (Array.isArray(userRoles?.data)) {
        roleNames = userRoles.data.map((role) => role.name);
    } else if (Array.isArray(userRoles?.data.data)) {
        roleNames = userRoles.data.data.map((role) => role.name);
    }
    
    if (!roleNames) {
        throw new NotFoundError('No roles found ');
    }
    
    if (!roleNames.includes('admin')) {
        throw new UnauthorizedError('Not an admin');
    }
};

export async function isAuthorizedGeneric({
    userId,
    jwtToken,
    allowedRoles,
}: {
  userId: number;
  jwtToken: string;
  allowedRoles: allRole[];
}) {
    let userRolesResponse;

    try {
        userRolesResponse = await axios.get<GetRolesResponseGeneric>(
            `${microServiceConfig.USER_SERVICE_URL}role/user/${userId}`,
            {
                headers: {
                    Authorization: jwtToken,
                },
            }
        );
    } catch (error) {
        logger.error(error);
        throw new UnauthorizedError('User not authorized');
    }

    const rolesData = userRolesResponse.data.data;

    if (!Array.isArray(rolesData) || rolesData.length === 0) {
        throw new NotFoundError('No roles found');
    }

    rolesData.forEach((role) => {
        if (!allowedRoles.includes(role as allRole)) {
            throw new UnauthorizedError('User not authorized');
        }
    });
}
