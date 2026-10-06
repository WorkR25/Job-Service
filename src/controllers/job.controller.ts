import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import CompanyCityRepository from '../repository/companyCity.repository';
import JobRepository, { JOB_LIST_TABS, JobListTab } from '../repository/job.repository';
import JobSkillRepository from '../repository/jobSkill.repository';
import JobService from '../services/job.service';
import { AuthRequest } from '../types/AuthRequest';

const jobRepository= new JobRepository();
const jobSkillRepository= new JobSkillRepository();
const companyCityRepository= new CompanyCityRepository();
const jobService= new JobService(jobRepository, jobSkillRepository, companyCityRepository);

async function getJobDetailsById(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const id= Number(req.params.id) ;

        const getJobDetailsData= {
            id
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

async function getAllJobsPagination(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const jwtToken = String( req.headers.authorization );
        const userId = Number( req.user?.id );
        const page = Math.max(parseInt(req.query.page as string) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
        const company = typeof req.query.company === 'string' ? req.query.company.trim().slice(0, 100) : '';
        const companyId = parseInt(req.query.companyId as string) || undefined;
        const tabParam = String(req.query.tab ?? 'all');
        const tab: JobListTab = (JOB_LIST_TABS as readonly string[]).includes(tabParam) ? (tabParam as JobListTab) : 'all';
        const includeCounts = req.query.counts === 'true';
        const response = await jobService.getAllJobsServicePagination({
            jwtToken,
            limit,
            page,
            userId,
            company: company || undefined,
            companyId,
            tab,
            includeCounts,
        });
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Paginated Jobs fetched successfully',
            data: response ,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getHiringCompanies(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const name = typeof req.query.name === 'string' ? req.query.name.trim().slice(0, 100) : '';
        const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 8, 1), 20);
        const response = await jobService.getHiringCompaniesService({ name: name || undefined, limit });
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Hiring companies fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

export default {
    getHiringCompanies,
    createJob,
    deleteJob,
    updateJob,
    getAllJobs,
    getJobDetailsById,
    getAllJobsPagination
};
