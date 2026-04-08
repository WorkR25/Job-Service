import {
    InferCreationAttributes,
    Op,
    Optional,
    Transaction,
    WhereOptions,
} from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

import Company from '../db/models/company.model';
import Job from '../db/models/job.model';
import { NotFoundError } from '../utils/errors/app.error';
import BaseRepository from './base.repository';

class JobRepository extends BaseRepository<Job> {
    constructor() {
        super(Job);
    }
    async updateById(
        id: number,
        data: Partial<Job>,
        transaction?: Transaction
    ): Promise<Job> {
        const record = await this.model.findByPk(id);

        if (!record) {
            throw new NotFoundError(`Record with id ${id} not found`);
        }

        record.set(data);
        await record.save({ transaction });

        return record;
    }

    async softDelete(
        whereOptions: WhereOptions<Job>,
        transaction?: Transaction
    ): Promise<boolean> {
        const record = await this.model.findOne({
            where: {
                ...whereOptions,
            },
            transaction,
        });

        if (!record) {
            return false;
        }

        record.deleted_at = new Date();
        await record.save({ transaction });
        return true;
    }

    async create(
        data: Optional<
      InferCreationAttributes<Job, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<Job, { omit: never }>>
    >,
        transaction?: Transaction
    ): Promise<Job> {
        const record = await this.model.create(data, { transaction: transaction });
        return record;
    }

    async findAndCountAll({
        limit,
        offset,
    }: {
    limit: number;
    offset: number;
  }) {
        const records = await this.model.findAndCountAll({
            attributes: [
                'created_at',
                'location_id',
                'id',
                'salary_min',
                'salary_max',
                'apply_link',
            ],
            include: [
                {
                    association: Job.associations.jobTitle,
                    attributes: ['title'],
                },
                {
                    association: Job.associations.company,
                    attributes: ['name', 'logo'],
                },
                {
                    association: Job.associations.employmentType,
                    attributes: ['name'],
                }
            ],
            where: {
                deleted_at: { [Op.eq]: null },
            },
            order: [['created_at', 'DESC']],
            limit,
            offset,
        });
        return records;
    }

    async findAll(): Promise<Job[]> {
        const records = await this.model.findAll({
            attributes: [
                'created_at',
                'location_id',
                'id',
                'salary_min',
                'salary_max',
                'apply_link',
            ],
            include: [
                {
                    association: Job.associations.jobTitle,
                    attributes: ['title'],
                },
                {
                    association: Job.associations.company,
                    attributes: ['name', 'logo'],
                },
            ],
            where: {
                deleted_at: {
                    [Op.eq]: null,
                },
            },
            order: [['created_at', 'DESC']],
        });
        return records;
    }

    async findByApplyLink(applyLink: string): Promise<Job | null> {
        return await this.model.findOne({
            where: { apply_link: applyLink }
        });
    }

    async getJobDetails(id: number) {
        const response = await this.model.findByPk(id, {
            attributes: [
                'salary_min',
                'salary_max',
                'apply_link',
                'created_at',
                'description',
            ],
            include: [
                {
                    association: Job.associations.jobTitle,
                    attributes: ['title'],
                },
                {
                    association: Job.associations.employmentType,
                    attributes: ['name'],
                },
                {
                    association: Job.associations.company,
                    attributes: ['name', 'logo', 'description', 'website'],
                    include: [
                        {
                            association: Company.associations.companySize,
                            attributes: ['min_employees', 'max_employees'],
                        },
                        {
                            association: Company.associations.industry,
                            attributes: ['name'],
                        }
                    ]
                },
                {
                    association: Job.associations.experienceLevel,
                    attributes: ['name', 'min_years', 'max_years'],
                },
            ],
        });
        return response;
    }
}

export default JobRepository;
