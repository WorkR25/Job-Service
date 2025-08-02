import { Transaction } from 'sequelize';

import JobSkill from '../db/models/jobSkill.model';
import BaseRepository from './base.repository';

class JobSkillRepository extends BaseRepository<JobSkill>{

    constructor(){
        super(JobSkill);
    }

    async createBulk(bulkData: { job_id: number, skill_id: number }[], transaction: Transaction){
        return await this.model.bulkCreate(bulkData, {transaction: transaction});
    }

}

export default JobSkillRepository ;