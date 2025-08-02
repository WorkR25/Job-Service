import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import EmploymentTypeRepository from '../repository/employmentType.repository';
import EmploymentTypeService from '../services/employmetType.service';
import { AuthRequest } from '../types/AuthRequest';

const employmentTypeRepository= new EmploymentTypeRepository();
const employmentTypeService= new EmploymentTypeService(employmentTypeRepository);

async function createEmploymentTypeController(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const {name, description}= req.body;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const createData = {
            userId,
            jwtToken,
            name,
            description,
        };
        const response = await employmentTypeService.createEmploymentType(createData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employment type created successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getEmploymentTypeController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const getData= {
            userId,
            jwtToken
        };
        const response=  await employmentTypeService.getEmploymentType(getData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employment type fetched successfully',
            data: response,
            error: {}
        });

    } catch (error) {
        next(error);
    }
}

async function deleteEmploymentTypeController(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const {id}= req.body ;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const deleteData= {
            userId,
            jwtToken,
            id: Number(id)
        };
        const response= await employmentTypeService.deleteEmploymentType(deleteData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employment type deleted successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function updateEmploymentTypeController(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const {id, name, description}= req.body ;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const updateData= {
            userId,
            jwtToken,
            id: Number(id),
            name,
            description,
        };
        const response = await employmentTypeService.updateEmploymentType(updateData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employment type updated successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

export default {
    createEmploymentTypeController,
    getEmploymentTypeController,
    deleteEmploymentTypeController,
    updateEmploymentTypeController,
};