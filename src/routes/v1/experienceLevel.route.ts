import { Router } from 'express';

import experienceLevelController from '../../controllers/experienceLevel.controller';
import authenticationMiddleware from '../../middlewares/authentication.middleware';
import { validateRequestBody } from '../../validators';
import { CreateExperienceLevelSchema, DeleteExperienceLevelSchema,  UpdateExperienceLevelSchema } from '../../validators/experienceLevel.validator';

const experienceLevelRouter = Router();

experienceLevelRouter.get('/', authenticationMiddleware, experienceLevelController.findExperienceLevelController);
experienceLevelRouter.get('/:id', authenticationMiddleware, experienceLevelController.findByIdExperienceLevelController);
experienceLevelRouter.post('/', authenticationMiddleware, validateRequestBody(CreateExperienceLevelSchema), experienceLevelController.createExperienceLevelController);
experienceLevelRouter.put('/', authenticationMiddleware, validateRequestBody(UpdateExperienceLevelSchema), experienceLevelController.updateExperienceLevelController);
experienceLevelRouter.delete('/', authenticationMiddleware, validateRequestBody(DeleteExperienceLevelSchema), experienceLevelController.deleteExperienceLevelController);

export default experienceLevelRouter ;