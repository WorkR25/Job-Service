import { InferCreationAttributes, Optional, Transaction, WhereOptions } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

import CompanyCity from '../db/models/companyCity.model';
// import { NotFoundError } from '../utils/errors/app.error';
import BaseRepository from './base.repository';

class CompanyCityRepository extends BaseRepository<CompanyCity>{

    constructor(){
        super(CompanyCity);
    }

    async findByCompanyId(company_id: number, location_id: number){
        return await this.model.findOne({where:{company_id, location_id}});
    }

    async create(data: Optional<InferCreationAttributes<CompanyCity, { omit: never; }>, NullishPropertiesOf<InferCreationAttributes<CompanyCity, { omit: never; }>>>, transaction?: Transaction): Promise<CompanyCity> {
        return await this.model.create(data, {transaction});
    }

    async delete(whereOptions: WhereOptions<CompanyCity>, transaction?: Transaction): Promise<void> {
        await this.model.destroy({
            where: {
                ...whereOptions
            }, transaction
        });
        
        // if(!record) {
        //     throw new NotFoundError(`Record not found for deletion with options: ${JSON.stringify(whereOptions)}`);
        // }
        
        return;
    }
}

export default CompanyCityRepository;