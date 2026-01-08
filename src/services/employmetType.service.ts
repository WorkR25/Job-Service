import logger from '../configs/logger.config';
import { 
    CreateEmploymentTypeDto, 
    DeleteEmplymentTypeDto, 
    GetEmploymentType, 
    UpdateEmploymentTypeDto 
} from '../dtos/employmentType.dto';
import EmploymentTypeRepository from '../repository/employmentType.repository';
import { InternalServerError } from '../utils/errors/app.error';
import { isAuthorized, isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class EmploymentTypeService {
    private employmentTypeRepository: EmploymentTypeRepository;

    constructor(employmentTypeRepository: EmploymentTypeRepository) {
        this.employmentTypeRepository = employmentTypeRepository;
    }

    async createEmploymentType(createData: CreateEmploymentTypeDto) {
        try {
            const { userId, jwtToken, ...rest } = createData;
            await isAuthorized(userId, jwtToken);
            return await this.employmentTypeRepository.create({ ...rest });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error creating employment type');
        }
    }

    async deleteEmploymentType(deleteData: DeleteEmplymentTypeDto) {
        try {
            const { userId, jwtToken, id } = deleteData;
            await isAuthorized(userId, jwtToken);
            return await this.employmentTypeRepository.delete({ id });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error deleting employment type');
        }
    }

    async getEmploymentType(getData: GetEmploymentType) {
        try {
            const { userId, jwtToken } = getData;
            await isAuthorizedGeneric({jwtToken, userId, allowedRoles: ['operations_admin', 'admin']});

            return await this.employmentTypeRepository.findAll();
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching employment types');
        }
    }

    async updateEmploymentType(updateData: UpdateEmploymentTypeDto) {
        try {
            const { userId, jwtToken, id, ...rest } = updateData;
            await isAuthorized(userId, jwtToken);
            return await this.employmentTypeRepository.updateById(id, { ...rest });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error updating employment type');
        }
    }
}

export default EmploymentTypeService;
