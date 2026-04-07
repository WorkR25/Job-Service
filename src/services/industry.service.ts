import IndustryRepository from '../repository/industry.repository';
import { isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class IndustryService {
    private industryRepository: IndustryRepository; 

    constructor(industryRepository: IndustryRepository){
        this.industryRepository = industryRepository ;
    }

    async getAllService(data: {jwtToken: string, userId: number, name: string}){
        const { userId, jwtToken } = data ;
        await isAuthorizedGeneric({ userId, jwtToken, allowedRoles: ['operations_admin' , 'admin'] });            
        const response = await this.industryRepository.findAllByName(data.name);
        return response ;
    }
}

export default IndustryService ;
