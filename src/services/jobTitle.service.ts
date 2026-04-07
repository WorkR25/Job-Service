import logger from '../configs/logger.config';
import { 
    CreateJobTitleDto, 
    DeleteJobTitleDto, 
    GetJobTitleDto, 
    UpdateJobTitleDto 
} from '../dtos/jobTitle.dto';
import JobTitleRepository from '../repository/jobTitle.repository';
import { BadRequestError } from '../utils/errors/app.error';
import { isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class JobTitleService {
    private jobTitleRepository: JobTitleRepository;

    constructor(jobTitleRepository: JobTitleRepository) {
        this.jobTitleRepository = jobTitleRepository;
    }

    async getJobTitleService(getData: GetJobTitleDto) {
        const { userId, jwtToken, title } = getData;
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

        const records = await this.jobTitleRepository.getJobTitle(title);
        return records.map((record) => ({ id: record.id, name: record.title }));
    }

    async delJobTitleService(deleteData: DeleteJobTitleDto) {
        const { userId, jwtToken, id } = deleteData;
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

        const checkJobTitle = await this.jobTitleRepository.findById(id);
        if (!checkJobTitle) {
            const error = new BadRequestError('Job title does not exist');
            logger.error('jobTitle.service/delJobTitleService', { error, id });
            throw error;
        }

        return await this.jobTitleRepository.delete({ id });
    }

    async updateJobTitleService(updateData: UpdateJobTitleDto) {
        const { id, title, userId, jwtToken } = updateData;
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

        const checkJobTitle = await this.jobTitleRepository.findById(id);
        if (!checkJobTitle) {
            const error = new BadRequestError('Job title does not exist');
            logger.error('jobTitle.service/updateJobTitleService', { error, id });
            throw error;
        }

        return await this.jobTitleRepository.updateById(id, { title });
    }

    async createJobTitleService(createData: CreateJobTitleDto) {
        const { title, userId, jwtToken } = createData;
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

        const checkJobTitle = await this.jobTitleRepository.findByTitle(title);
        if (checkJobTitle) {
            const error = new BadRequestError('Job title already exists');
            logger.error('jobTitle.service/createJobTitleService', { error, title });
            throw error;
        }

        return await this.jobTitleRepository.create({ title });
    }
}

export default JobTitleService;
