import logger from '../configs/logger.config';
import { 
    CreateExperienceLevelDto, 
    DeleteExperienceLevelDto, 
    GetExperienceLevelByIdDto, 
    GetExperienceLevelDto, 
    UpdateExperienceLevelDto 
} from '../dtos/experienceLevel.dto';
import ExperienceLevelRepository from '../repository/experienceLevel.repository';
import { BadRequestError } from '../utils/errors/app.error';
import { isAuthorized, isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class ExperienceLevelService {
    private experienceLevelRepository: ExperienceLevelRepository;

    constructor(experienceLevelRepository: ExperienceLevelRepository) {
        this.experienceLevelRepository = experienceLevelRepository;
    }

    async createExperinceLevelService(createData: CreateExperienceLevelDto) {
        const { userId, jwtToken, name, maxYears, minYears } = createData;
        await isAuthorized(userId, jwtToken);

        const checkExperience = await this.experienceLevelRepository.findByName(name);
        if (checkExperience) {
            const error = new BadRequestError('Experience level already exists');
            logger.error('experienceLevel.service/createExperinceLevelService', { error, name });
            throw error;
        }

        return await this.experienceLevelRepository.create({ name, minYears, maxYears });
    }

    async getExperienceLevelByIdService(getDataById: GetExperienceLevelByIdDto) {
        const { userId, jwtToken, id } = getDataById;
        await isAuthorized(userId, jwtToken);
        return await this.experienceLevelRepository.findById(id);
    }

    async getExperienceLevelService(getData: GetExperienceLevelDto) {
        const { userId, jwtToken, name } = getData;
        await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});
        
        return await this.experienceLevelRepository.getExperienceLevel(name);
    }

    async updateExperienceLevelService(updateData: UpdateExperienceLevelDto) {
        const { userId, jwtToken, id, name, minYears, maxYears } = updateData;
        await isAuthorized(userId, jwtToken);

        const checkExperience = await this.experienceLevelRepository.findById(id);
        if (!checkExperience) {
            const error = new BadRequestError('Experience level does not exist');
            logger.error('experienceLevel.service/updateExperienceLevelService', { error, id });
            throw error;
        }

        return await this.experienceLevelRepository.updateById(id, { name, minYears, maxYears });
    }

    async deleteExperienceLevelService(deleteData: DeleteExperienceLevelDto) {
        const { userId, jwtToken, id } = deleteData;
        await isAuthorized(userId, jwtToken);

        const checkExperience = await this.experienceLevelRepository.findById(id);
        if (!checkExperience) {
            const error = new BadRequestError('Experience level does not exist');
            logger.error('experienceLevel.service/deleteExperienceLevelService', { error, id });
            throw error;
        }

        return await this.experienceLevelRepository.delete({ id });
    }
}

export default ExperienceLevelService;
