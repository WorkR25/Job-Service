import Company from './company.model';
import EmploymentType from './employmentType.model';
import ExperienceLevel from './experienceLevel.model';
import Job from './job.model';
import JobTitle from './jobTitle.model';


Job.belongsTo(JobTitle, {
    foreignKey: 'title_id',
    onDelete: 'CASCADE',
});

JobTitle.hasMany(Job, {
    foreignKey: 'title_id',
});


Job.belongsTo(EmploymentType, {
    foreignKey: 'employment_type_id',
    onDelete: 'CASCADE',
});

EmploymentType.hasMany(Job, {
    foreignKey: 'employment_type_id',
});


Job.belongsTo(ExperienceLevel, {
    foreignKey: 'experience_level_id',
    onDelete: 'CASCADE', 
});

ExperienceLevel.hasMany(Job, {
    foreignKey: 'experience_level_id',
});


Job.belongsTo(Company, {
    foreignKey: 'company_id',
    onDelete: 'CASCADE', 
});

Company.hasMany(Job, {
    foreignKey: 'company_id',
});
