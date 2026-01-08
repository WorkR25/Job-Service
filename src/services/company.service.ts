import logger from '../configs/logger.config';
import { CreateCompanyDto, DeleteCompanyDto, UpdateCompanyDto } from '../dtos/company.dto';
import CompanyRepository from '../repository/company.repository';
import { BadRequestError, InternalServerError } from '../utils/errors/app.error';
import { isAuthorized, isAuthorizedGeneric } from '../utils/services/AuthorizationService';

class CompanyService {
    private companyRepository: CompanyRepository;

    constructor(companyRepository: CompanyRepository) {
        this.companyRepository = companyRepository;
    }

    async getCompanyDetailsById(id: number) {
        try {
            return await this.companyRepository.findById(id);
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching company details');
        }
    }

    async deleteCompany(deleteData: DeleteCompanyDto) {
        try {
            const { userId, jwtToken, id } = deleteData;
            await isAuthorized(userId, jwtToken);
            return await this.companyRepository.delete({ id });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error deleting company');
        }
    }

    async updateCompanyService(updateData: UpdateCompanyDto) {
        try {
            const { userId, jwtToken, id, ...rest } = updateData;
            await isAuthorized(userId, jwtToken);
            return await this.companyRepository.updateById(id, { ...rest });
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error updating company');
        }
    }

    async createCompany(createData: CreateCompanyDto) {
        try {
            const { userId, jwtToken, name, ...rest } = createData;
            // await isAuthorized(userId, jwtToken);
            await isAuthorizedGeneric({ userId, jwtToken, allowedRoles: ['operations_admin', 'admin'] });

            const checkCompany = await this.companyRepository.findByName(name);
            if (checkCompany) {
                throw new BadRequestError('Company already created');
            }
            const companyRecord = await this.companyRepository.create({ name, ...rest });
            return { companyRecord };
        } catch (error) {
            logger.error(error);
            // if it's already a BadRequestError, rethrow to preserve it
            if (error instanceof BadRequestError) throw error;
            throw new InternalServerError('Error creating company');
        }
    }

    async getAllCompanies(name: string, userId: number, jwtToken: string) {
        try {
            await isAuthorizedGeneric({ userId, jwtToken, allowedRoles: ['operations_admin', 'admin'] });
            // await isAuthorized(userId, jwtToken);
            return await this.companyRepository.getCompanyByName(name);
        } catch (error) {
            logger.error(error);
            throw new InternalServerError('Error fetching all companies');
        }
    }
}

export default CompanyService;
