import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { verifyToken } from '../auth/auth';
import { UnauthorizedError } from '../errors/app.error';

export async function isAuthenticated(authToken: string){
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