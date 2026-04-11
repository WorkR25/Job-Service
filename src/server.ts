import './db/models/association';

import cors from 'cors';
import express from 'express';

import logger from './configs/logger.config';
import { frontendConfig, serverConfig } from './configs/server.config';
import sequelize from './db/models/sequelize';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { appErrorHandler, genericErrorHandler, sequelizeErrorHandler } from './middlewares/error.middleware';
import apiRouter from './routes';

const app = express();
app.use(cors({
    origin: [frontendConfig.FRONTEND_URL], 
    credentials: true,
}));

app.use(express.json());

app.use(attachCorrelationIdMiddleware);

app.use('/api', apiRouter);

app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy'
    });
});

app.use(sequelizeErrorHandler);
app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully');
});