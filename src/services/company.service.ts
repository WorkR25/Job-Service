import { CreateCompanyDto, DeleteCompanyDto, UpdateCompanyDto } from '../dtos/company.dto';
import CompanyRepository from '../repository/company.repository';
import { BadRequestError } from '../utils/errors/app.error';
import { isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class CompanyService {
    private companyRepository: CompanyRepository;

    constructor(companyRepository: CompanyRepository) {
        this.companyRepository = companyRepository;
    }

    async findCompanyByNameService({name} : {name: string}){
        const response = await this.companyRepository.findByName(name);
        return response;
    }

    async getCompanyDetailsById(id: number) {
        return await this.companyRepository.findById(id);
    }

    async deleteCompany(deleteData: DeleteCompanyDto) {
        const { userId, jwtToken, id } = deleteData;
        await isAuthorizedGeneric({userId, jwtToken, allowedRoles: ['operations_admin', 'admin']});
        return await this.companyRepository.delete({ id });
    }

    async updateCompanyService(updateData: UpdateCompanyDto) {
        const { userId, jwtToken, id, ...rest } = updateData;
        await isAuthorizedGeneric({userId, jwtToken, allowedRoles: ['operations_admin', 'admin']});
        return await this.companyRepository.updateById(id, { ...rest });
    }

    async createCompany(createData: CreateCompanyDto) {
        const { userId, jwtToken, name, ...rest } = createData;
        await isAuthorizedGeneric({ userId, jwtToken, allowedRoles: ['operations_admin', 'admin'] });

        const checkCompany = await this.companyRepository.findByName(name);
        if (checkCompany) {
            throw new BadRequestError('Company already exists');
        }
        const companyRecord = await this.companyRepository.create({ name, ...rest });
        return { companyRecord };
    }

    async getAllCompanies(name: string, userId: number, jwtToken: string) {
        await isAuthorizedGeneric({ userId, jwtToken, allowedRoles: ['operations_admin', 'admin'] });
        return await this.companyRepository.getCompanyByName(name);
    }
}

export default CompanyService;
