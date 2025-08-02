import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import JobTitleRepository from '../repository/jobTitle.repository';
import JobTitleService from '../services/jobTitle.service';
import { AuthRequest } from '../types/AuthRequest';

const jobTitleRepository = new JobTitleRepository();
const jobTitleService = new JobTitleService(jobTitleRepository);

async function getJobTitle(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const title = req.query.name;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        if(!title){
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'No job title',
                data: {},
                error: {
                    message: 'Bad Request'
                }
            });
        }

        const getData= {
            title: String(title),
            userId: Number(userId),
            jwtToken: String(jwtToken)
        };

        const response = await jobTitleService.getJobTitleService(getData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Job title retrieved successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
};

async function deleteJobTitle(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const id = req.body.id ;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        const deleteData= {
            id: Number(id),
            userId: Number(userId),
            jwtToken: String(jwtToken),
        };

        const response = await jobTitleService.delJobTitleService(deleteData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Job title deleted successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function updateJobTitle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { id, title }= req.body ;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;
        const updateJobTitle={
            id: Number(id),
            title: String(title),
            userId: Number(userId),
            jwtToken: String(jwtToken),
        };
        const response= await jobTitleService.updateJobTitleService(updateJobTitle);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Job title updated successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function createJobTitle(req: AuthRequest, res: Response, next: NextFunction){
    try{
        const {title } = req.body;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        const createData= {
            title:String(title),
            userId: Number(userId),
            jwtToken: String(jwtToken)
        };
        console.log(createData);

        const response = await jobTitleService.createJobTitleService(createData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Job title created successfully',
            data: response,
            error: {}
        });
    }catch(error){
        next(error);
    }
}

export default {
    getJobTitle,
    deleteJobTitle,
    updateJobTitle,
    createJobTitle,
};