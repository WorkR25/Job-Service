import { CreateEmploymentTypeDto, DeleteEmplymentTypeDto, GetEmploymentType, UpdateEmploymentTypeDto } from '../dtos/employmentType.dto';
import EmploymentTypeRepository from '../repository/employmentType.repository';
import { isAuthorized } from '../utils/services/AuthorizationService';

class EmploymentTypeService {
    private employmentTypeRepository: EmploymentTypeRepository;

    constructor( employmentTypeRepository: EmploymentTypeRepository){
        this.employmentTypeRepository= employmentTypeRepository;
    }

    async createEmploymentType(createData: CreateEmploymentTypeDto){
        const {userId, jwtToken, ...rest} = createData;
        await isAuthorized(userId, jwtToken);
        return await this.employmentTypeRepository.create({...rest});
    }

    async deleteEmploymentType(deleteData: DeleteEmplymentTypeDto ){
        const {userId, jwtToken, id} = deleteData;
        await isAuthorized(userId, jwtToken);
        return await this.employmentTypeRepository.delete({id});
    }

    async getEmploymentType(getData: GetEmploymentType){
        const {userId, jwtToken } = getData;
        await isAuthorized(userId, jwtToken);
        return await this.employmentTypeRepository.findAll();
    }

    async updateEmploymentType(updateData: UpdateEmploymentTypeDto){
        const {userId, jwtToken, id,...rest } = updateData;
        await isAuthorized(userId, jwtToken);
        return await this.employmentTypeRepository.updateById(id, {...rest});
    }
}

export default EmploymentTypeService ;