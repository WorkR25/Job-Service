import axios from 'axios';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import logger from '../configs/logger.config';
import { microServiceConfig } from '../configs/server.config';
import { GetRolesResponse } from '../types/GetJobTitleServiceTypes';
import { verifyToken } from '../utils/auth/auth';
import { NotFoundError, UnauthorizedError } from '../utils/errors/app.error';

class BaseService {
    async isAuthenticated(authToken: string){
        try {
            const decoded = verifyToken(authToken as string);
            return decoded;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return new UnauthorizedError('Session expired. Please login again.');
            } else if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedError('Invalid token');
            } else {
                throw new UnauthorizedError('Verification of token failed');
            }
        }
    }

    async isAuthorized(userId: number, jwtToken: string){
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
        }
        console.log('object');
            
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
}

export default BaseService ;