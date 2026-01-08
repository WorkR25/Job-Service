import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import CompanyRepository from '../repository/company.repository';
import CompanyService from '../services/company.service';
import { AuthRequest } from '../types/AuthRequest';
import { BadRequestError } from '../utils/errors/app.error';

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);

async function uploadLogoHandler(req: Request, res: Response, next: NextFunction){
    try {
        if(!req.file){
            throw new BadRequestError('No profile pic');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileUrl = (req.file as any).location;

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Logo added successfully',
            data: {
                fileUrl
            },
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getCompanyDetailsById(req: Request, res: Response, next: NextFunction) {
    try {
        const id= Number(req.params.id);
        const response = await companyService.getCompanyDetailsById(id);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Company fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function createComapany(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const {name, website, logo, description, cityId, company_size_id, industry_id} = req.body; 
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const createData = {
            name,
            website,
            logo,
            userId,
            jwtToken,
            city_id: Number(cityId),
            description,
            company_size_id: Number(company_size_id),
            industry_id: Number(industry_id),
        };

        const response = await companyService.createCompany(createData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Company created successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }

}

async function updateCompany(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const {id, name, website, logo}= req.body;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);
        
        const updateData= {
            userId,
            jwtToken,
            id: Number(id),
            name,
            website,
            logo
        };
        const response = await companyService.updateCompanyService(updateData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Details updated successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function deleteCompany(req: AuthRequest, res: Response, next: NextFunction){
    try {
        const id = Number(req.body.id) ;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const deleteData= {
            userId,
            jwtToken,
            id
        };

        const response = await companyService.deleteCompany(deleteData);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Details deleted successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getAllCompanies(req: AuthRequest, res: Response, next: NextFunction){
    try {    
        const name= String(req.query.name) ;
        const userId = Number( req.user?.id );
        const jwtToken = String(req.headers.authorization);

        const response = await companyService.getAllCompanies(name, userId, jwtToken);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Details fetched successfully',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

export default {
    uploadLogoHandler,
    getCompanyDetailsById,
    createComapany,
    updateCompany,
    deleteCompany,
    getAllCompanies
};