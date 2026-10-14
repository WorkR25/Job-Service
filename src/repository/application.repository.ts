import { Op } from 'sequelize';

import Application from '../db/models/application.model';
import { BadRequestError } from '../utils/errors/app.error';
import BaseRepository from './base.repository';
import Company from '../db/models/company.model';
import Job from '../db/models/job.model';
import JobTitle from '../db/models/jobTitle.model';

class ApplicationRepository extends BaseRepository<Application> {
    constructor() {
        super(Application);
    }

    async findAndCountAll({ jobId, limit, offset }: { jobId: number, limit: number; offset: number }) {
        const records = await this.model.findAndCountAll({
            where: {
                job_id: jobId,
                deleted_at: {
                    [Op.eq]: null,
                },
            },
            order: [['applied_at', 'DESC']],
            limit,
            offset,
        });

        return records ;
    }

    async getDetails(where: Partial<Application>) {
        const response = await this.model.findAll({
            where,
        });

        return response;
    }

    async findOne(where: Partial<Application>) {
        return await this.model.findOne({
            where: {
                ...where,
                deleted_at: {
                    [Op.eq]: null,
                },
            },
        });
    }

    async softDelete(where: Partial<Application>) {
        const record = await this.model.findOne({
            where: {
                ...where,
                deleted_at: {
                    [Op.eq]: null,
                },
            },
        });
        if (!record) {
            throw new BadRequestError('Application does not exist');
        }

        record.deleted_at = new Date();
        await record.save();
        return true;
    }

    async findMany(where?: Partial<Application>) {
        return await this.model.findAll({
            where: {
                ...where,
                deleted_at: {
                    [Op.eq]: null,
                },
            },
        });
    }
  

    async getCandidateApplicationHistory(
        candidateId: number,
        limit: number,
        offset: number
    ) {
        return await this.model.findAndCountAll({
            where: {
                candidate_id: candidateId,
                deleted_at: {
                    [Op.eq]: null,
                },
            },
            include: [
                {
                    model: Job,
                    as: 'job',
                    required: true,
                    attributes: ['id', 'company_id'],
                    where: {
                        deleted_at: {
                            [Op.eq]: null,
                        },
                    },
                    include: [
                        {
                            model: Company,
                            as: 'company',
                            attributes: ['id', 'name', 'logo'],
                        },
                        {
                            model: JobTitle,
                            as: 'jobTitle',
                            attributes: ['title'],
                        },
                    ],
                },
            ],
            order: [['applied_at', 'DESC']],
            limit,
            offset,
            distinct: true,
        });
    }
}

export default ApplicationRepository;
