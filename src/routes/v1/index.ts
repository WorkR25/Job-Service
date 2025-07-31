import express from 'express';

import experienceLevelRouter from './experienceLevel.route';
import jobTitleRouter from './jobTitle.route';
import pingRouter from './ping.route';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);

v1Router.use('/job-title', jobTitleRouter);

v1Router.use('/experience-level', experienceLevelRouter);

export default v1Router;