import { Router } from 'express';

import jobController from '../../controllers/job.controller';
import authenticationMiddleware from '../../middlewares/authentication.middleware';
import {  validateRequestBody} from '../../validators';
import { CreateJobSchema, DeleteJobSchema, UpdateJobSchema } from '../../validators/job.validator';

const jobRouter = Router();

jobRouter.get('/id/:id', jobController.getJobDetailsById);
jobRouter.get('/', jobController.getAllJobs );
// jobRouter.get('/pages', authenticationMiddleware, jobController.getAllJobsPagination);
jobRouter.get('/pages', jobController.getAllJobsPagination);
jobRouter.get('/companies', jobController.getHiringCompanies);
jobRouter.post('/', authenticationMiddleware, validateRequestBody(CreateJobSchema), jobController.createJob);
jobRouter.delete('/', authenticationMiddleware, validateRequestBody(DeleteJobSchema) ,jobController.deleteJob);
jobRouter.put('/', authenticationMiddleware, validateRequestBody(UpdateJobSchema) ,jobController.updateJob);


export default jobRouter ;