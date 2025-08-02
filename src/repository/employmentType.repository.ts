import EmploymentType from '../db/models/employmentType.model';
import BaseRepository from './base.repository';

class EmploymentTypeRepository extends BaseRepository<EmploymentType>{

    constructor(){
        super(EmploymentType);
    }
}

export default EmploymentTypeRepository ;