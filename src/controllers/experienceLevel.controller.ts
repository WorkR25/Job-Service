import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ExperienceLevelRepository from '../repository/experienceLevel.repository';
import ExperienceLevelService from '../services/experienceLevel.service';
import { AuthRequest } from '../types/AuthRequest';

const experienceLevelRepository = new ExperienceLevelRepository();
const experienceLevelService = new ExperienceLevelService(experienceLevelRepository);


async function createExperienceLevelController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const {name, minYears, maxYears} = req.body;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        const createData = {
            name: String(name),
            minYears: Number(minYears),
            maxYears: Number(maxYears),
            userId: Number(userId),
            jwtToken: String(jwtToken),
        };
        
        const response = await experienceLevelService.createExperinceLevelService(createData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Experience Level created successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function findByIdExperienceLevelController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const id= req.params.id ;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        const findByIdData= {
            id: Number(id),
            userId: Number(userId),
            jwtToken: String(jwtToken),
        };

        const response = await experienceLevelService.getExperienceLevelByIdService(findByIdData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Experience Level fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function findExperienceLevelController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const name= req.query.name ;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        const findByIdData= {
            name: String(name),
            userId: Number(userId),
            jwtToken: String(jwtToken),
        };

        const response = await experienceLevelService.getExperienceLevelService(findByIdData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Experience Level fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function updateExperienceLevelController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const {id, name, minYears, maxYears} = req.body;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        const updateData= {
            id: Number(id),
            name: String(name),
            minYears: Number(minYears),
            maxYears: Number(maxYears),
            userId: Number(userId),
            jwtToken: String(jwtToken),

        };

        const response = await experienceLevelService.updateExperienceLevelService(updateData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Experience level updated successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function deleteExperienceLevelController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const {id} = req.body;
        const userId = req.user?.id ;
        const jwtToken = req.headers.authorization;

        const deleteData = {
            id: Number(id),
            userId: Number(userId),
            jwtToken: String(jwtToken),
        };

        const response = await experienceLevelService.deleteExperienceLevelService(deleteData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Experience level deletd successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

export default {
    deleteExperienceLevelController,
    createExperienceLevelController,
    findByIdExperienceLevelController,
    updateExperienceLevelController,
    findExperienceLevelController,
};
