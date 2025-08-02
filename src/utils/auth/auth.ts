import jwt from 'jsonwebtoken';

import { serverConfig } from '../../configs/server.config';
import { UserTokenPayload } from '../../types/UserTokenPayload';

export function verifyToken(token: string) {
    try {
        console.log(serverConfig.JWT_SECRET);
        return jwt.verify(token, serverConfig.JWT_SECRET) as UserTokenPayload;
    } catch (error) {
        throw error;
    }

}