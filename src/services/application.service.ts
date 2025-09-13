import logger from '../configs/logger.config';
import {
    CreateApplicationDto,
    DeleteApplicationDto,
    GetAllApplicationDto,
    GetApplicationDetailsDto,
} from '../dtos/application.dto';
import ApplicationRepository from '../repository/application.repository';
import {
    BadRequestError,
    InternalServerError,
    UnauthorizedError,
} from '../utils/errors/app.error';
import { isAuthorized } from '../utils/services/AuthorizationService';
import { getUserDetailsService } from '../utils/services/UserService';

class ApplicationService {
    private applicationRepository: ApplicationRepository;

    constructor(applicationRepository: ApplicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    async createApplicationService(createdata: CreateApplicationDto) {
        try {
            const { userId, jobId } = createdata;

            const record = await this.applicationRepository.findOne({
                candidate_id: userId,
                job_id: jobId,
            });
            if (record) {
                return record;
                throw new BadRequestError('Application already exists');
            }

            return await this.applicationRepository.create({
                job_id: jobId,
                candidate_id: userId,
            });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error creating application');
        }
    }

    async deleteApplicationService(deleteData: DeleteApplicationDto) {
        try {
            const { userId, jobId, jwtToken } = deleteData;
            await isAuthorized(userId, jwtToken);
            return await this.applicationRepository.softDelete({
                candidate_id: userId,
                job_id: jobId,
            });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error deleting application');
        }
    }

    async getApplicationByUserIdService(userId: number) {
        try {
            return await this.applicationRepository.findMany({
                candidate_id: userId,
            });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching applications');
        }
    }

    async getAllApplicationService(getData: GetAllApplicationDto) {
        try {
            const { userId, jwtToken } = getData;
            await isAuthorized(userId, jwtToken);
            return await this.applicationRepository.findMany();
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching all applications');
        }
    }

    async getApplicationDetailsService(getData: GetApplicationDetailsDto) {
        try {
            const records = await this.applicationRepository.getDetails({
                job_id: getData.jobId,
            });

            const response = await Promise.all(
                records.map(async (record) => {
                    const plainRecord = record.toJSON();
                    const userId = plainRecord.candidate_id;
                    const userRecord = await getUserDetailsService(
                        getData.jwtToken,
                        userId
                    );
                    return {
                        candidate_id: plainRecord.candidate_id,
                        job_id: plainRecord.job_id,
                        ...userRecord.data,
                    };
                })
            );
            return response;
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching application details');
        }
    }

    async getApplicantsByJobIdPagination({
        jwtToken,
        userId,
        jobId,
        page,
        limit,
    }: {
    jwtToken: string;
    userId: number;
    jobId: number;
    page: number;
    limit: number;
  }) {
        try {
            const offset = (page - 1) * limit;

            await isAuthorized(userId, jwtToken);

            const { rows: records, count: totalCount } =
                await this.applicationRepository.findAndCountAll({
                    jobId,
                    limit,
                    offset,
                });

            const totalPages = Math.ceil(totalCount / limit);

            const response = await Promise.all(
                records.map(async (record) => {
                    const plainRecord = record.toJSON();
                    const userId = plainRecord.candidate_id;
                    const userRecord = await getUserDetailsService(
                        jwtToken,
                        userId
                    );
                    return {
                        candidate_id: plainRecord.candidate_id,
                        job_id: plainRecord.job_id,
                        ...userRecord.data,
                    };
                })
            );

            return {
                records: response,
                pagination: {
                    totalCount,
                    totalPages,
                    currentPage: page,
                    limit,
                },
            };
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                logger.error(error);
                throw new UnauthorizedError(error.message);
            }
            logger.error(error);
            throw new InternalServerError('Error fetching applicants pagination');
        }
    }
}

export default ApplicationService;
