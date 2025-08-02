import Company from './company.model';
import EmploymentType from './employmentType.model';
import ExperienceLevel from './experienceLevel.model';
import Job from './job.model';
import JobTitle from './jobTitle.model';


JobTitle.hasMany(Job, {
    foreignKey: 'title_id',
    as: 'job'
});


EmploymentType.hasMany(Job, {
    foreignKey: 'employment_type_id',
});



ExperienceLevel.hasMany(Job, {
    foreignKey: 'experience_level_id',
});



Company.hasMany(Job, {
    foreignKey: 'company_id',
});


Job.belongsTo(JobTitle, {
    foreignKey: 'title_id',
    onDelete: 'CASCADE',
    as: 'jobTitle'
});

Job.belongsTo(EmploymentType, {
    foreignKey: 'employment_type_id',
    onDelete: 'CASCADE',
    as: 'employmentType'
});

Job.belongsTo(ExperienceLevel, {
    foreignKey: 'experience_level_id',
    onDelete: 'CASCADE', 
    as: 'experienceLevel'
});

Job.belongsTo(Company, {
    foreignKey: 'company_id',
    onDelete: 'CASCADE', 
    as: 'companyId'
});
