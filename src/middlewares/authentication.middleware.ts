import { NextFunction, Response } from 'express';

import logger from '../configs/logger.config';
import BaseService from '../services/base.service';
import { AuthRequest } from '../types/AuthRequest';
import { UserTokenPayload } from '../types/UserTokenPayload';
// import { isAuthenticated } from '../utils/auth/services/AuthenticationService';
import { UnauthorizedError } from '../utils/errors/app.error';

const baseService = new BaseService();

const authenticationMiddleware = async (req : AuthRequest, _res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logger.error('Authentication failed: No token provided');
        throw new UnauthorizedError('No token provided');
    }

    const decoded  = await baseService.isAuthenticated(authHeader);
    req.user = decoded as UserTokenPayload;
    next();
};

export default authenticationMiddleware;