import logger from '../configs/logger.config';
import IndustryRepository from '../repository/industry.repository';
import { InternalServerError } from '../utils/errors/app.error';
import { isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class IndustryService {
    private industryRepository: IndustryRepository; 

    constructor(industryRepository: IndustryRepository){
        this.industryRepository = industryRepository ;
    }

    async getAllService(data: {jwtToken: string, userId: number, name: string}){
        try {
            // await isAuthorized(data.userId, data.jwtToken);
            const { userId, jwtToken } = data ;

            await isAuthorizedGeneric({ userId, jwtToken, allowedRoles: ['operations_admin' , 'admin'] });            
            const response = await this.industryRepository.findAllByName(data.name);
            return response ;
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching all industries');
        }

    }
}

export default IndustryService ;