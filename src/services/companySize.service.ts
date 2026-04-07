import CompanySizeRepository from '../repository/companySize.repository';
import { isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class CompanySizeService {
    private companySizeRepository: CompanySizeRepository ;
    
    constructor(companySizeRepository: CompanySizeRepository){
        this.companySizeRepository = companySizeRepository ;
    }

    async getAllService(getData : {jwtToken: string, userId: number}){
        const { jwtToken, userId } = getData ;
        await isAuthorizedGeneric({ userId, jwtToken, allowedRoles: ['operations_admin','admin' ] });
        const response = await this.companySizeRepository.findAll();
        return response ;
    }
    
}

export default CompanySizeService ;
