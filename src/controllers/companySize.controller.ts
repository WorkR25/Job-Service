import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../configs/logger.config';
import CompanySizeRepository from '../repository/companySize.repository';
import CompanySizeService from '../services/companySize.service';
import { AuthRequest } from '../types/AuthRequest';

const companySizeRepository = new CompanySizeRepository();
const companySizeService = new CompanySizeService(companySizeRepository);
async function getAllCompanySizes(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId = Number(req.user?.id) ;
        const jwtToken = String( req.headers.authorization );

        const response =await companySizeService.getAllService({jwtToken, userId});
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Company Sizes fetched successfully',
            data: response,
            error: {}
        });

    } catch (error) {
        logger.error('companySize.controller/getAllCompanySizes', error);
        next(error);
    }
}

export default {
    getAllCompanySizes
};