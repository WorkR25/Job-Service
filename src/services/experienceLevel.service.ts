import { CreateExperienceLevelDto, DeleteExperienceLevelDto, GetExperienceLevelByIdDto, GetExperienceLevelDto, UpdateExperienceLevelDto } from '../dtos/experienceLevel.dto';
import ExperienceLevelRepository from '../repository/experienceLevel.repository';
import { BadRequestError } from '../utils/errors/app.error';
import { isAuthorized } from '../utils/services/AuthorizationService';

class ExperienceLevelService {
    private experienceLevelRepository: ExperienceLevelRepository;

    constructor( experienceLevelRepository: ExperienceLevelRepository){
        this.experienceLevelRepository= experienceLevelRepository ;
    }

    async createExperinceLevelService(createData: CreateExperienceLevelDto){
        const {userId, jwtToken, name, maxYears, minYears} = createData;
        await isAuthorized(userId, jwtToken);

        const checkExperience = await this.experienceLevelRepository.findByName(name);
        if(checkExperience){
            throw new BadRequestError('Experience level already exist');
        }
        
        return await this.experienceLevelRepository.create({name, minYears, maxYears});
    }

    async getExperienceLevelByIdService(getDataById: GetExperienceLevelByIdDto){
        const {userId, jwtToken, id} = getDataById;
        await isAuthorized(userId, jwtToken);
        return this.experienceLevelRepository.findById(id);
    }

    async getExperienceLevelService(getData: GetExperienceLevelDto){
        const {userId, jwtToken, name} = getData;
        await isAuthorized(userId, jwtToken);
        return await this.experienceLevelRepository.getExperienceLevel(name);
    }

    async updateExperienceLevelService(updateData: UpdateExperienceLevelDto){
        const {userId, jwtToken, id, name, minYears, maxYears} = updateData;
        await isAuthorized(userId, jwtToken);

        const checkExperience = await this.experienceLevelRepository.findById(id);
        if(!checkExperience){
            throw new BadRequestError('Experience level does not exist');
        }

        return await this.experienceLevelRepository.updateById(id, {name, minYears, maxYears});
    }

    async deleteExperienceLevelService(deleteData: DeleteExperienceLevelDto){
        const {userId, jwtToken, id} = deleteData;
        await isAuthorized(userId, jwtToken);

        const checkExperience = await this.experienceLevelRepository.findById(id);
        if(!checkExperience){
            throw new BadRequestError('Experience level does not exist');
        }

        return await this.experienceLevelRepository.delete({id});
    }
    
}

export default ExperienceLevelService;