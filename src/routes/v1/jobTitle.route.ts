import { Router } from 'express';

import jobTitleController from '../../controllers/jobTitle.controller';
import authenticationMiddleware from '../../middlewares/authentication.middleware';
import { validateRequestBody } from '../../validators';
import { CreateJobTitleSchema, DeleteJobTitleSchema, UpdateJobTitleSchema } from '../../validators/jobTitle.validator';

const jobTitleRouter = Router();

jobTitleRouter.get('/', authenticationMiddleware, jobTitleController.getJobTitle );
jobTitleRouter.delete('/', authenticationMiddleware, validateRequestBody(DeleteJobTitleSchema), jobTitleController.deleteJobTitle );
jobTitleRouter.put('/', authenticationMiddleware, validateRequestBody(UpdateJobTitleSchema), jobTitleController.updateJobTitle );
jobTitleRouter.post('/', authenticationMiddleware, validateRequestBody(CreateJobTitleSchema), jobTitleController.createJobTitle);

export default jobTitleRouter ;