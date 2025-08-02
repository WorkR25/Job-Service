import { Op } from 'sequelize';

import ExperienceLevel from '../db/models/experienceLevel.model';
import BaseRepository from './base.repository';

class ExperienceLevelRepository extends BaseRepository<ExperienceLevel>{

    constructor(){
        super(ExperienceLevel);
    }
    
    async getExperienceLevel(experienceLevel: string){
        console.log('object', experienceLevel);
        const results = await this.model.findAll({
            where: {
                name: {
                    [Op.like]: experienceLevel + '%'
                }
            }
        });
        return results ;
    }

    async findByName(name: string){
        const response = await this.model.findOne({where: {name}});
        return response ;
    }
    
}

export default ExperienceLevelRepository ;