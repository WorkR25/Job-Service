import { Router } from 'express';

import applicationController from '../../controllers/application.controller';
import authenticationMiddleware from '../../middlewares/authentication.middleware';
import { validateRequestBody } from '../../validators';
import { createApplicationSchema } from '../../validators/application.validator';

const applicationRouter= Router();

applicationRouter.post('/', authenticationMiddleware, validateRequestBody(createApplicationSchema), applicationController.createApplication );
applicationRouter.delete('/:id', authenticationMiddleware, applicationController.deleteApplication);
applicationRouter.get('/', authenticationMiddleware, applicationController.getAllApplication);
applicationRouter.get('/job-id/:jobId', authenticationMiddleware, applicationController.getApplicationDetails);
applicationRouter.get('/pages/job-id', authenticationMiddleware, applicationController.getApplicantsByJobIdPagination);
applicationRouter.get('/user/', authenticationMiddleware, applicationController.getApplicationByUserId);

export default applicationRouter ;