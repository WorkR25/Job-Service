import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ApplicationRepository from '../repository/application.repository';
import ApplicationService from '../services/application.service';
import { AuthRequest } from '../types/AuthRequest';
import { isAuthorized } from '../utils/services/AuthorizationService';

const applicationRepository= new ApplicationRepository();
const applicationService= new ApplicationService(applicationRepository);

async function createApplication(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId= Number(req.user?.id) ;
        const { jobId } = req.body;
        const jwtToken= String(req.headers.authorization);

        const response= await applicationService.createApplicationService({userId, jobId: Number(jobId), jwtToken});
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Application added successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function deleteApplication(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId= Number(req.user?.id);
        const jobId= Number(req.params.id);
        const jwtToken= String(req.headers.authorization);

        const response= await applicationService.deleteApplicationService({userId, jobId, jwtToken});
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Application deleted successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getApplicationByUserId(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId= Number(req.user?.id);
        const response= await applicationService.getApplicationByUserIdService(userId);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Application fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getAllApplication(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId= Number(req.user?.id);
        const jwtToken= String(req.headers.authorization);

        await isAuthorized(userId, jwtToken);

        const response= await applicationService.getAllApplicationService({userId, jwtToken});
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Applications fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getApplicationDetails(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId= Number(req.user?.id);
        const jobId= Number(req.params.jobId);
        const jwtToken= String(req.headers.authorization);
        
        const response = await applicationService.getApplicationDetailsService({userId, jobId, jwtToken});
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Application Details Fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getApplicantsByJobIdPagination(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId = Number( req.user?.id ) ;
        const jwtToken = String(req.headers.authorization);
        const jobId = parseInt(req.query.jobId as string);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const response = await applicationService.getApplicantsByJobIdPagination({jwtToken, userId, jobId, page, limit});

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Applicants fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

    async function getCandidateApplicationHistoryPagination(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = Number(req.user?.id);
        const candidateId = Number(req.params.candidateId);
        const jwtToken = String(req.headers.authorization);

        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if (!Number.isInteger(candidateId) || candidateId <= 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid candidate ID',
                data: {},
                error: {},
            });
            return;
        }

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message:
                    'Page must be >= 1 and limit must be between 1 and 100',
                data: {},
                error: {},
            });
            return;
        }

        const response =
            await applicationService.getCandidateApplicationHistoryService({
                userId,
                jwtToken,
                candidateId,
                page,
                limit,
            });

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Candidate application history fetched successfully',
            data: response,
            error: {},
        });
    } catch (error) {
        next(error);
    }
}

export default {
    createApplication,
    deleteApplication,
    getApplicationByUserId,
    getAllApplication,
    getApplicationDetails,
    getApplicantsByJobIdPagination,
    getCandidateApplicationHistoryPagination,
};



