import { col, fn, InferCreationAttributes, literal, Op, Optional, Transaction } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

import Company from '../db/models/company.model';
import Job from '../db/models/job.model';
import BaseRepository from './base.repository';

class CompanyRepository extends BaseRepository<Company>{

    constructor(){
        super(Company);
    }

    async findByName(name: string){
        return await this.model.findOne({where: {name}});
    }

    async create(data: Optional<InferCreationAttributes<Company, { omit: never; }>, NullishPropertiesOf<InferCreationAttributes<Company, { omit: never; }>>>, transaction?:Transaction): Promise<Company> {
        const record = await this.model.create(data, {transaction});
        return record;
    }

    async getCompanyByName(name: string){
        const results = await this.model.findAll({
            where: {
                name: {
                    [Op.like]: name + '%'
                }
            }
        });
        return results ;
    }

    /**
     * Companies that currently have at least one open (non-deleted) job,
     * with their open-job count. Optionally filtered by a name substring.
     */
    async findHiringCompanies({ name, limit }: { name?: string; limit: number }) {
        const where = name
            ? { name: { [Op.like]: `%${name.replace(/[\\%_]/g, (char) => `\\${char}`)}%` } }
            : {};
        const records = await this.model.findAll({
            attributes: ['id', 'name', 'logo', [fn('COUNT', col('Jobs.id')), 'jobCount']],
            include: [
                {
                    model: Job,
                    attributes: [],
                    where: { deleted_at: { [Op.eq]: null } },
                    required: true,
                },
            ],
            where,
            group: ['Company.id'],
            order: [[literal('jobCount'), 'DESC'], ['name', 'ASC']],
            limit,
            subQuery: false,
        });
        return records.map((record) => ({
            id: record.id,
            name: record.name,
            logo: record.logo,
            jobCount: Number(record.get('jobCount')),
        }));
    }
}

export default CompanyRepository ;
