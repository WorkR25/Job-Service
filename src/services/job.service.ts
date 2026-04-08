import logger from '../configs/logger.config';
import sequelize from '../db/models/sequelize';
import {
    CreateJobDto,
    DeleteJobDto,
    GetAllJobDto,
    GetAllJobsPagination,
    GetJobDetailsDto,
    UpdateJobDto,
} from '../dtos/job.dto';
import CompanyCityRepository from '../repository/companyCity.repository';
import JobRepository from '../repository/job.repository';
import JobSkillRepository from '../repository/jobSkill.repository';
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
} from '../utils/errors/app.error';
import { isAuthorizedGeneric } from '../utils/services/AuthorizationService';
import { getCityById } from '../utils/services/CityService';
import { getLocationById } from '../utils/services/LocationService';
import { getSkillById } from '../utils/services/SkillService';

class JobService {
    private jobRepository: JobRepository;
    private jobSkillRepository: JobSkillRepository;
    private companyCityRepository: CompanyCityRepository;

    constructor(
        jobRepository: JobRepository,
        jobSkillRepository: JobSkillRepository,
        companyCityRepository: CompanyCityRepository
    ) {
        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.companyCityRepository = companyCityRepository;
    }

    async getJobDetailsById(getJobDetails: GetJobDetailsDto) {
        const { id } = getJobDetails;

        const checkJob = await this.jobRepository.findById(id);
        if (!checkJob) {
            const error = new NotFoundError('Job not found');
            logger.error('job.service/getJobDetailsById', { error, id });
            throw error;
        }

        if(checkJob.deleted_at != null) {
            const error = new BadRequestError('This Job is no longer exists');
            logger.error('job.service/getJobDetailsById', { error, id });
            throw error;
        }

        const city = await getCityById(checkJob.location_id);
        const data = await this.jobRepository.getJobDetails(Number(id));
        const skillIds = await this.jobSkillRepository.findSkillByJobId(id);

        const skills = await Promise.all(
            skillIds.map(async (skillId) => {
                const skill = await getSkillById(skillId.skill_id);
                return { id: skillId.skill_id, name: skill.data.data.name };
            })
        );

        const response = {
            ...data?.toJSON(),
            city: { name: city.data.data.name },
            skills,
        };

        return response;
    }

    async getAllJobsServicePagination(getAllJobData: GetAllJobsPagination) {
        const { page = 1, limit = 10 } = getAllJobData;

        const offset = (page - 1) * limit;

        const { rows: jobs, count: totalCount } = await this.jobRepository.findAndCountAll({ limit, offset });
        const response = await Promise.all(
            jobs.map(async (job) => {
                const locationRes = await getLocationById(job.location_id);
                const location = locationRes?.data?.data;

                const city = location?.name ?? null;
                const state = location?.state?.name ?? null;
                const country = location?.state?.country?.name ?? null;

                const skillIds = await this.jobSkillRepository.findSkillByJobId(job.id);

                let skills: string[] = [];

                if (skillIds.length > 0) {
                    skills = await Promise.all(
                        skillIds.map(async (skillId) => {
                            const skillRes = await getSkillById(skillId.skill_id);
                            return skillRes?.data?.data?.name ?? null;
                        })
                    );
                }

                return {
                    ...job.get({ plain: true }),
                    city,
                    state,
                    country,
                    skills,
                };
            })
        );
        const totalPages = Math.ceil(totalCount / limit);

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

    async getAllJobsService(getAllJobData: GetAllJobDto) {
        const {  } = getAllJobData;
        const record = await this.jobRepository.findAll();
        const response = await Promise.all(
            record.map(async (job) => {
                const location = await getLocationById(job.location_id);
                const skillIds = await this.jobSkillRepository.findSkillByJobId(
                    job.id
                );

                if (skillIds.length === 0) {
                    return {
                        ...job.toJSON(),
                        city: location.data.data.name,
                        state: location.data.data.state.name,
                        country: location.data.data.state.country.name,
                    };
                }

                const skills = await Promise.all(
                    skillIds.map(async (skillId) => {
                        const skill = await getSkillById(skillId.skill_id);
                        return skill.data.data.name;
                    })
                );

                return {
                    ...job.toJSON(),
                    city: location.data.data.name,
                    state: location.data.data.state.name,
                    country: location.data.data.state.country.name,
                    skills,
                };
            })
        );

        return response;
    }

    async createJobService(createJobData: CreateJobDto) {
        const { userId, jwtToken, skillIds, ...rest } = createJobData;
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});
        
        const existingJob = await this.jobRepository.findByApplyLink(rest.apply_link);
        if (existingJob) {
            const error = new ConflictError('A job with this apply link already exists');
            logger.error('job.service/createJobService', { error, apply_link: rest.apply_link });
            throw error;
        }

        const transaction = await sequelize.transaction();
        try {
            const jobRecord = await this.jobRepository.create(
                { ...rest },
                transaction
            );
            const bulkData = skillIds.map((skillId) => {
                return { job_id: jobRecord.id, skill_id: skillId };
            });
            const jobSkills = await this.jobSkillRepository.createBulk(
                bulkData,
                transaction
            );
            await this.companyCityRepository.create(
                { company_id: jobRecord.company_id, location_id: jobRecord.location_id },
                transaction
            );
            await transaction.commit();
            return { jobRecord, jobSkills };
        } catch (error) {
            logger.error(error);
            await transaction.rollback();
            throw new InternalServerError('Error creating job');
        }
    }

    async deleteJobService(deleteJobData: DeleteJobDto) {
        const { userId, jwtToken, id } = deleteJobData;

        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

        const checkJob = await this.jobRepository.findById(id);
        if (!checkJob) {
            const error = new BadRequestError('Job does not exist');
            logger.error('job.service/deleteJobService', { error, id });
            throw error;
        }

        const transaction = await sequelize.transaction();

        try {
            await this.jobSkillRepository.delete({ job_id: id }, transaction);
            await this.jobRepository.softDelete({ id }, transaction);
            await this.companyCityRepository.delete(
                { location_id: checkJob.location_id, company_id: checkJob.company_id },
                transaction
            );
            await transaction.commit();
            return true;
        } catch (error) {
            logger.error(error);
            await transaction.rollback();
            throw new InternalServerError('Error deleting job');
        }
    }

    async updateJobService(updateJobData: UpdateJobDto) {
        const { userId, jwtToken, id, skillIds, ...rest } = updateJobData;
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

        const checkJob = await this.jobRepository.findById(id);
        if (!checkJob) {
            const error = new BadRequestError('Job does not exist');
            logger.error('job.service/updateJobService', { error, id });
            throw error;
        }

        const skillIdResponse = await this.jobSkillRepository.findSkillByJobId(
            checkJob.id
        );
        const currentSkillIdArray = skillIdResponse.map((skillId) => {
            return skillId.skill_id;
        });

        const transaction = await sequelize.transaction();
        try {
            await Promise.all(
                skillIds.map(async (skillId) => {
                    if (!currentSkillIdArray.includes(skillId)) {
                        await this.jobSkillRepository.create(
                            { job_id: checkJob.id, skill_id: skillId },
                            transaction
                        );
                    }
                })
            );

            await Promise.all(
                currentSkillIdArray.map(async (skillId) => {
                    if (!skillIds.includes(skillId)) {
                        await this.jobSkillRepository.delete(
                            { job_id: checkJob.id, skill_id: skillId },
                            transaction
                        );
                    }
                })
            );
            const record = await this.jobRepository.updateById(id, rest, transaction);
            await transaction.commit();
            return {
                record,
                skillIds,
            };
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            throw new InternalServerError('Error updating job details');
        }
    }
}

export default JobService;
