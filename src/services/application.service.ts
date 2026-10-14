import logger from '../configs/logger.config';
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
            const error = new BadRequestError('You have already applied for this job');
            logger.error('application.service/createApplicationService', { error, userId, jobId });
            throw error;
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
                    applied_at: plainRecord.applied_at ?? null,
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

    async getCandidateApplicationHistoryService({
        userId,
        jwtToken,
        candidateId,
        page,
        limit,
    }: {
        userId: number;
        jwtToken: string;
        candidateId: number;
        page: number;
        limit: number;
    }) {
        await isAuthorized(userId, jwtToken);

        const offset = (page - 1) * limit;

        const { rows, count } =
            await this.applicationRepository.getCandidateApplicationHistory(
                candidateId,
                limit,
                offset
            );

        const applications = rows.map((record) => {
            const item = record.get({ plain: true }) as any;

            return {
                application_id: item.id,
                candidate_id: item.candidate_id,
                job_id: item.job_id,
                company_id: item.job?.company_id ?? null,
                company_name: item.job?.company?.name ?? null,
                company_logo: item.job?.company?.logo ?? null,
                job_title: item.job?.jobTitle?.title ?? null,
                applied_at: item.applied_at,
            };
        });

        const totalPages = Math.ceil(count / limit);

        return {
            candidate_id: candidateId,
            total_applications: count,
            applications,
            pagination: {
                current_page: page,
                limit,
                total_pages: totalPages,
                has_next_page: page < totalPages,
                has_previous_page: page > 1,
            },
        };
    }
}

export default ApplicationService;
