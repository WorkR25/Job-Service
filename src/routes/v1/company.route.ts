import { Router } from 'express';

import { upload } from '../../configs/aws.config';
import companyController from '../../controllers/company.controller';
import authenticationMiddleware from '../../middlewares/authentication.middleware';
import { validateRequestBody } from '../../validators';
import { createCompanySchema, deleteCompanySchema, updateCompanySchema } from '../../validators/company.validator';

const comapanyRouter = Router();

comapanyRouter.post('/upload-logo', authenticationMiddleware, upload.single('file'), companyController.uploadLogoHandler);
comapanyRouter.get('/find-companies', authenticationMiddleware, companyController.findCompanyByName);
comapanyRouter.get('/:id', authenticationMiddleware, companyController.getCompanyDetailsById);

comapanyRouter.get('/', authenticationMiddleware, companyController.getAllCompanies);
comapanyRouter.post('/', authenticationMiddleware, validateRequestBody(createCompanySchema), companyController.createComapany);
comapanyRouter.put('/', authenticationMiddleware, validateRequestBody(updateCompanySchema),companyController.updateCompany);
comapanyRouter.delete('/', authenticationMiddleware, validateRequestBody(deleteCompanySchema),companyController.deleteCompany);

export default comapanyRouter;