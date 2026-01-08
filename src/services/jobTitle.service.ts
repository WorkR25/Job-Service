import logger from '../configs/logger.config';
import { 
    CreateJobTitleDto, 
    DeleteJobTitleDto, 
    GetJobTitleDto, 
    UpdateJobTitleDto 
} from '../dtos/jobTitle.dto';
import JobTitleRepository from '../repository/jobTitle.repository';
import { BadRequestError, InternalServerError } from '../utils/errors/app.error';
import { isAuthorized, isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class JobTitleService {
    private jobTitleRepository: JobTitleRepository;

    constructor(jobTitleRepository: JobTitleRepository) {
        this.jobTitleRepository = jobTitleRepository;
    }

    async getJobTitleService(getData: GetJobTitleDto) {
        const { userId, jwtToken, title } = getData;
        // await isAuthorized(userId, jwtToken);
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

        try {
            const records = await this.jobTitleRepository.getJobTitle(title);
            return records.map((record) => ({ id: record.id, name: record.title }));
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching job titles');
        }
    }

    async delJobTitleService(deleteData: DeleteJobTitleDto) {
        const { userId, jwtToken, id } = deleteData;
        await isAuthorized(userId, jwtToken);

        try {
            const checkJobTitle = await this.jobTitleRepository.findById(id);
            if (!checkJobTitle) {
                throw new BadRequestError('Job title does not exist');
            }

            return await this.jobTitleRepository.delete({ id });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error deleting job title');
        }
    }

    async updateJobTitleService(updateData: UpdateJobTitleDto) {
        const { id, title, userId, jwtToken } = updateData;
        await isAuthorized(userId, jwtToken);

        try {
            const checkJobTitle = await this.jobTitleRepository.findById(id);
            if (!checkJobTitle) {
                throw new BadRequestError('Job title does not exist');
            }

            return await this.jobTitleRepository.updateById(id, { title });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error updating job title');
        }
    }

    async createJobTitleService(createData: CreateJobTitleDto) {
        const { title, userId, jwtToken } = createData;
        // await isAuthorized(userId, jwtToken);
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});


        try {
            const checkJobTitle = await this.jobTitleRepository.findByTitle(title);
            if (checkJobTitle) {
                throw new BadRequestError('Job title already exists');
            }

            return await this.jobTitleRepository.create({ title });
        } catch (error) {
            logger.error(error);
            if(error instanceof BadRequestError){
                throw error ;
            }
            throw new InternalServerError('Error creating job title');
        }
    }
}

export default JobTitleService;
