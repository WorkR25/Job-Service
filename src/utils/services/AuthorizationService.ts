import axios from 'axios';

import logger from '../../configs/logger.config';
import { microServiceConfig } from '../../configs/server.config';
import { GetRolesResponse } from '../../types/GetJobTitleServiceTypes';
import { NotFoundError, UnauthorizedError } from '../errors/app.error';

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
        console.log(error);
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
}