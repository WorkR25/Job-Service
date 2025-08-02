import { Router } from 'express';

import jobController from '../../controllers/job.controller';
import authenticationMiddleware from '../../middlewares/authentication.middleware';
import {  validateRequestBody} from '../../validators';
import { CreateJobSchema, DeleteJobSchema, UpdateJobSchema } from '../../validators/job.validator';

const jobRouter = Router();

jobRouter.get('/:id', authenticationMiddleware, jobController.getJobDetailsById);
jobRouter.get('/', authenticationMiddleware, jobController.getAllJobs );
jobRouter.post('/', authenticationMiddleware, validateRequestBody(CreateJobSchema), jobController.createJob);
jobRouter.delete('/', authenticationMiddleware, validateRequestBody(DeleteJobSchema) ,jobController.deleteJob);
jobRouter.put('/', authenticationMiddleware, validateRequestBody(UpdateJobSchema) ,jobController.updateJob);


export default jobRouter ;