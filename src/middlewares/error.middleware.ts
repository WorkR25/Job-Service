import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DatabaseError, ForeignKeyConstraintError, TimeoutError, UniqueConstraintError, ValidationError } from 'sequelize';

import logger from '../configs/logger.config';
import { AppError } from '../utils/errors/app.error';


export const appErrorHandler = (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error
    });
};

export const genericErrorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Generic error handler',error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong!',
        data: {},
        error
    });
};

export const sequelizeErrorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Sequelize error handler',error);

    if (error instanceof ValidationError) {
        console.log(error.errors[0].message);
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.errors[0].message,
            data: {},
            error
        });
    } else if (error instanceof UniqueConstraintError) {
        res.status(StatusCodes.CONFLICT).json({
            success: false,
            message: error.errors[0].message,
            data: {},
            error
        });
    } else if (error instanceof DatabaseError) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
            data: {},
            error
        });
    } else if ( error instanceof ForeignKeyConstraintError ) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
            data: {},
            error
        });
    } else if (error instanceof TimeoutError) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            success: false,
            message: error.message,
            data: {},
            error
        });
        return;
    }
};