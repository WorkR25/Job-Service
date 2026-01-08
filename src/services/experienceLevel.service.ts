import logger from '../configs/logger.config';
import { 
    CreateExperienceLevelDto, 
    DeleteExperienceLevelDto, 
    GetExperienceLevelByIdDto, 
    GetExperienceLevelDto, 
    UpdateExperienceLevelDto 
} from '../dtos/experienceLevel.dto';
import ExperienceLevelRepository from '../repository/experienceLevel.repository';
import { BadRequestError, InternalServerError } from '../utils/errors/app.error';
import { isAuthorized, isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class ExperienceLevelService {
    private experienceLevelRepository: ExperienceLevelRepository;

    constructor(experienceLevelRepository: ExperienceLevelRepository) {
        this.experienceLevelRepository = experienceLevelRepository;
    }

    async createExperinceLevelService(createData: CreateExperienceLevelDto) {
        try {
            const { userId, jwtToken, name, maxYears, minYears } = createData;
            await isAuthorized(userId, jwtToken);

            const checkExperience = await this.experienceLevelRepository.findByName(name);
            if (checkExperience) {
                throw new BadRequestError('Experience level already exists');
            }

            return await this.experienceLevelRepository.create({ name, minYears, maxYears });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error creating experience level');
        }
    }

    async getExperienceLevelByIdService(getDataById: GetExperienceLevelByIdDto) {
        try {
            const { userId, jwtToken, id } = getDataById;
            await isAuthorized(userId, jwtToken);
            return await this.experienceLevelRepository.findById(id);
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching experience level by ID');
        }
    }

    async getExperienceLevelService(getData: GetExperienceLevelDto) {
        try {
            const { userId, jwtToken, name } = getData;
            // await isAuthorized(userId, jwtToken);
            await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});
            
            return await this.experienceLevelRepository.getExperienceLevel(name);
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching experience levels');
        }
    }

    async updateExperienceLevelService(updateData: UpdateExperienceLevelDto) {
        try {
            const { userId, jwtToken, id, name, minYears, maxYears } = updateData;
            await isAuthorized(userId, jwtToken);

            const checkExperience = await this.experienceLevelRepository.findById(id);
            if (!checkExperience) {
                throw new BadRequestError('Experience level does not exist');
            }

            return await this.experienceLevelRepository.updateById(id, { name, minYears, maxYears });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error updating experience level');
        }
    }

    async deleteExperienceLevelService(deleteData: DeleteExperienceLevelDto) {
        try {
            const { userId, jwtToken, id } = deleteData;
            await isAuthorized(userId, jwtToken);

            const checkExperience = await this.experienceLevelRepository.findById(id);
            if (!checkExperience) {
                throw new BadRequestError('Experience level does not exist');
            }

            return await this.experienceLevelRepository.delete({ id });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error deleting experience level');
        }
    }
}

export default ExperienceLevelService;
