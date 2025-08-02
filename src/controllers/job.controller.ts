import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import JobRepository from '../repository/job.repository';
import JobSkillRepository from '../repository/jobSkill.repository';
import JobService from '../services/job.service';
import { AuthRequest } from '../types/AuthRequest';

const jobRepository= new JobRepository();
const jobSkillRepository= new JobSkillRepository();
const jobService= new JobService(jobRepository, jobSkillRepository);

async function getJobDetailsById(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const id= Number(req.params.id) ;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const getJobDetailsData= {
            id,
            userId,
            jwtToken
        };

        const response = await jobService.getJobDetailsById(getJobDetailsData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Fetched jobs successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getAllJobs(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const getAllJobData= {
            userId,
            jwtToken
        };
        const response = await jobService.getAllJobsService(getAllJobData);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Fetched jobs successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function createJob(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const {...creationData}= req.body;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const createData= {
            userId,
            jwtToken,
            ...creationData
        };

        const response = await jobService.createJobService(createData);
        console.log('resp', response);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Created jobs successfully',
            data: response,
            error: {}
        });

    } catch (error) {
        next(error);
    }
}

async function deleteJob(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const {...data} = req.body;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const deleteData= {
            userId,
            jwtToken,
            ...data,
        };
        const response = await jobService.deleteJobService(deleteData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Deleted jobs successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function updateJob(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const {...data}= req.body;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const updateData= {
            userId,
            jwtToken,
            ...data,
        };

        const response = await jobService.updateJobService(updateData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Updated jobs successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }

}

export default {
    
    createJob,
    deleteJob,
    updateJob,
    getAllJobs,
    getJobDetailsById
};