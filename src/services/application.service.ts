import {
    CreateApplicationDto,
    DeleteApplicationDto,
    GetAllApplicationDto,
    GetApplicationDetailsDto,
} from '../dtos/application.dto';
import ApplicationRepository from '../repository/application.repository';
import { BadRequestError } from '../utils/errors/app.error';
import { isAuthorized } from '../utils/services/AuthorizationService';
import { getUserDetailsService } from '../utils/services/UserService';

class ApplicationService {
    private applicationRepository: ApplicationRepository;

    constructor(applicationRepository: ApplicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    async createApplicationService(createdata: CreateApplicationDto) {
        const { userId, jobId } = createdata;

        const record = await this.applicationRepository.findOne({
            candidate_id: userId,
            job_id: jobId,
        });
        if (record) {
            throw new BadRequestError('You have already applied for this job');
        }

        return await this.applicationRepository.create({
            job_id: jobId,
            candidate_id: userId,
        });
    }

    async deleteApplicationService(deleteData: DeleteApplicationDto) {
        const { userId, jobId, jwtToken } = deleteData;
        await isAuthorized(userId, jwtToken);
        return await this.applicationRepository.softDelete({
            candidate_id: userId,
            job_id: jobId,
        });
    }

    async getApplicationByUserIdService(userId: number) {
        return await this.applicationRepository.findMany({
            candidate_id: userId,
        });
    }

    async getAllApplicationService(getData: GetAllApplicationDto) {
        const { userId, jwtToken } = getData;
        await isAuthorized(userId, jwtToken);
        return await this.applicationRepository.findMany();
    }

    async getApplicationDetailsService(getData: GetApplicationDetailsDto) {
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
    }
}

export default ApplicationService;
