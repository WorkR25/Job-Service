import { Router } from 'express';

import employmentTypeController from '../../controllers/employmentType.controller';
import authenticationMiddleware from '../../middlewares/authentication.middleware';
import { validateRequestBody } from '../../validators';
import { CreateEmploymentTypeSchema, DeleteEmploymentTypeSchema, UpdateEmploymentTypeSchema } from '../../validators/employmentType.validator';

const employmentTypeRouter = Router();

employmentTypeRouter.get('/', authenticationMiddleware, employmentTypeController.getEmploymentTypeController);
employmentTypeRouter.post('/', authenticationMiddleware, validateRequestBody(CreateEmploymentTypeSchema) ,  employmentTypeController.createEmploymentTypeController);
employmentTypeRouter.put('/', authenticationMiddleware, validateRequestBody(UpdateEmploymentTypeSchema) , employmentTypeController.updateEmploymentTypeController);
employmentTypeRouter.delete('/', authenticationMiddleware, validateRequestBody(DeleteEmploymentTypeSchema) , employmentTypeController.deleteEmploymentTypeController);

export default employmentTypeRouter ;