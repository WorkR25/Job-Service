import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../configs/logger.config';
import IndustryRepository from '../repository/industry.repository';
import IndustryService from '../services/industry.service';
import { AuthRequest } from '../types/AuthRequest';

const industryRepository = new IndustryRepository();
const industryService = new IndustryService(industryRepository);

async function getAllIndustries(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId = Number(req.user?.id);
        const jwtToken = String(req.headers.authorization) ;
        const name = String(req.query.name) ;

        const response = await industryService.getAllService({jwtToken, userId, name});
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Industry fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        logger.error('industry.controller/getAllIndustries', error);
        next(error);
    }
}

export default {
    getAllIndustries
};