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

        try {
            const checkJob = await this.jobRepository.findById(id);
            if (!checkJob) {
                throw new NotFoundError('Job not found');
            }

            const city = await getCityById(checkJob.city_id);
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
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching job details');
        }
    }

    async getAllJobsServicePagination(getAllJobData: GetAllJobsPagination) {
        const { page = 1, limit = 10 } = getAllJobData;
        try {
            // return true ;
            const offset = (page - 1) * limit;

            const { rows: jobs, count: totalCount } =
                await this.jobRepository.findAndCountAll({ limit, offset });
            const response = await Promise.all(
                jobs.map(async (job) => {
                    const location = await getLocationById(job.city_id);
                    const skillIds = await this.jobSkillRepository.findSkillByJobId(
                        job.id
                    );

                    if (skillIds.length === 0) {
                        return {
                            ...job.get({ plain: true }),
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
                        ...job.get({ plain: true }),
                        city: location.data.data.name,
                        state: location.data.data.state.name,
                        country: location.data.data.state.country.name,
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
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching paginated jobs');
        }
    }

    async getAllJobsService(getAllJobData: GetAllJobDto) {
        const {  } = getAllJobData;
        try {
            const record = await this.jobRepository.findAll();
            const response = await Promise.all(
                record.map(async (job) => {
                    const location = await getLocationById(job.city_id);
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
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching jobs');
        }
    }

    async createJobService(createJobData: CreateJobDto) {
        const { userId, jwtToken, skillIds, ...rest } = createJobData;
        // await isAuthorized(userId, jwtToken);
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});
        
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
                { company_id: jobRecord.company_id, city_id: jobRecord.city_id },
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

        // await isAuthorized(userId, jwtToken);
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});


        const checkJob = await this.jobRepository.findById(id);
        if (!checkJob) {
            throw new BadRequestError('Job does not exist');
        }

        const transaction = await sequelize.transaction();

        try {
            await this.jobSkillRepository.delete({ job_id: id }, transaction);
            await this.jobRepository.softDelete({ id }, transaction);
            await this.companyCityRepository.delete(
                { city_id: checkJob.city_id, company_id: checkJob.company_id },
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
        // await isAuthorized(userId, jwtToken);
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});


        const checkJob = await this.jobRepository.findById(id);
        if (!checkJob) {
            throw new BadRequestError('Job does not exist');
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
            logger.error(error);
            await transaction.rollback();
            throw new InternalServerError('Error updating job details');
        }
    }
}

export default JobService;
