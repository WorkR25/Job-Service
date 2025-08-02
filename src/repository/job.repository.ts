import { InferCreationAttributes, Optional, Transaction } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

import Job from '../db/models/job.model';
import BaseRepository from './base.repository';

class JobRepository extends BaseRepository<Job>{

    constructor(){
        super(Job);
    }

    async create(data: Optional<InferCreationAttributes<Job, { omit: never; }>, NullishPropertiesOf<InferCreationAttributes<Job, { omit: never; }>>>, transaction?: Transaction): Promise<Job> {
        const record = await this.model.create(data, {transaction: transaction});
        return record;
    }

    async findAll(): Promise<Job[]> {
        const records = await this.model.findAll({
            attributes: ['is_remote','city_id'],
            include: [
                {
                    association: Job.associations.jobTitle,
                    attributes: ['title']
                },
                {
                    association: Job.associations.companyId,
                    attributes: ['name']
                }
            ]
        });
        return records;
    }

    async getJobDetails(id: number){
        const response = await this.model.findByPk(id, {
            attributes: ['salary_min', 'salary_max', 'is_remote', 'apply_link'],
            include: [
                {
                    association: Job.associations.jobTitle, 
                    attributes: ['title']
                },
                {
                    association: Job.associations.employmentType,
                    attributes: ['name']
                },
                {
                    association: Job.associations.companyId,
                    attributes: ['name']
                },
                {
                    association: Job.associations.experienceLevel,
                    attributes: ['name']
                }
               
            ]
        });
        return response;
    }



}

export default JobRepository;