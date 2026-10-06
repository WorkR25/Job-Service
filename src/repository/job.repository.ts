import {
    IncludeOptions,
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

export const JOB_LIST_TABS = ['all', 'new', 'remote', 'onsite', 'intern'] as const;
export type JobListTab = (typeof JOB_LIST_TABS)[number];

export type JobListFilters = {
    companyName?: string;
    companyId?: number;
    tab?: JobListTab;
    remoteLocationIds?: number[];
};

const NEW_JOB_WINDOW_MS = 24 * 60 * 60 * 1000;

function escapeLike(value: string) {
    return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

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

    private buildListQuery(filters: JobListFilters, tab: JobListTab) {
        const conditions: WhereOptions<Job>[] = [{ deleted_at: { [Op.eq]: null } }];
        const remoteIds = filters.remoteLocationIds ?? [];

        if (filters.companyId) {
            conditions.push({ company_id: filters.companyId });
        }
        if (tab === 'new') {
            conditions.push({ created_at: { [Op.gte]: new Date(Date.now() - NEW_JOB_WINDOW_MS) } });
        }
        if (tab === 'remote') {
            // No "Remote" location configured means no remote jobs.
            conditions.push({ location_id: { [Op.in]: remoteIds.length ? remoteIds : [-1] } });
        }
        if (tab === 'onsite' && remoteIds.length) {
            conditions.push({ location_id: { [Op.notIn]: remoteIds } });
        }

        const companyInclude: IncludeOptions = {
            association: Job.associations.company,
            attributes: ['id', 'name', 'logo'],
        };
        if (filters.companyName) {
            companyInclude.where = { name: { [Op.like]: `%${escapeLike(filters.companyName)}%` } };
            companyInclude.required = true;
        }

        const employmentTypeInclude: IncludeOptions = {
            association: Job.associations.employmentType,
            attributes: ['name'],
        };
        if (tab === 'intern') {
            employmentTypeInclude.where = { name: { [Op.like]: 'intern%' } };
            employmentTypeInclude.required = true;
        }

        return {
            where: { [Op.and]: conditions },
            include: [
                { association: Job.associations.jobTitle, attributes: ['title'] },
                companyInclude,
                employmentTypeInclude,
            ],
        };
    }

    async findAndCountAll({
        limit,
        offset,
        filters = {},
    }: {
    limit: number;
    offset: number;
    filters?: JobListFilters;
  }) {
        const { where, include } = this.buildListQuery(filters, filters.tab ?? 'all');
        const records = await this.model.findAndCountAll({
            attributes: [
                'created_at',
                'location_id',
                'id',
                'salary_min',
                'salary_max',
                'apply_link',
            ],
            include,
            where,
            distinct: true,
            order: [['created_at', 'DESC']],
            limit,
            offset,
        });
        return records;
    }

    async countByTab(filters: JobListFilters): Promise<Record<JobListTab, number>> {
        const counts = await Promise.all(
            JOB_LIST_TABS.map((tab) => {
                const { where, include } = this.buildListQuery(filters, tab);
                return this.model.count({ where, include, distinct: true, col: 'id' });
            })
        );
        return JOB_LIST_TABS.reduce((acc, tab, index) => {
            acc[tab] = counts[index];
            return acc;
        }, {} as Record<JobListTab, number>);
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
                'id',
                'location_id',
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
                    attributes: ['id', 'name', 'logo', 'description', 'website'],
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
