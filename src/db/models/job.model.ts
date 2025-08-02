import { Association, CreationOptional,  DataTypes,  ForeignKey,  InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';

import Company from './company.model';
import EmploymentType from './employmentType.model';
import ExperienceLevel from './experienceLevel.model';
import JobTitle from './jobTitle.model';
import sequelize from './sequelize';

class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>>{
    declare id: CreationOptional<number>;
    declare title_id: ForeignKey<JobTitle['id']>;
    declare employment_type_id: ForeignKey<EmploymentType['id']>;
    declare experience_level_id: ForeignKey<ExperienceLevel['id']>;
    declare salary_min: number;
    declare salary_max: number;
    declare recruiter_id: CreationOptional<number>;
    declare company_id: ForeignKey<Company['id']>;
    declare city_id: CreationOptional<number>;
    declare is_remote: boolean;
    declare apply_link: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date | null>;

    declare jobTitle?: NonAttribute<JobTitle>;

    static associations: {
        jobTitle: Association<Job, JobTitle> ;
        employmentType: Association<Job, EmploymentType>;
        experienceLevel: Association<Job, ExperienceLevel>
        companyId: Association<Job, Company>;

    };

}

Job.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: JobTitle,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    employment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: EmploymentType,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    experience_level_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: ExperienceLevel,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    salary_min: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    salary_max: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    recruiter_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: Company,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_remote: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    apply_link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    tableName: 'jobs',
    sequelize,
    underscored: true,
    timestamps: false,
});

// Job.belongsTo(JobTitle, {
//     foreignKey: 'title_id',
//     onDelete: 'CASCADE',
//     as: 'jobTitle'
// });

// Job.belongsTo(EmploymentType, {
//     foreignKey: 'employment_type_id',
//     onDelete: 'CASCADE',
//     as: 'employmentType'
// });

// Job.belongsTo(ExperienceLevel, {
//     foreignKey: 'experience_level_id',
//     onDelete: 'CASCADE', 
//     as: 'experienceLevel'
// });

// Job.belongsTo(Company, {
//     foreignKey: 'company_id',
//     onDelete: 'CASCADE', 
//     as: 'companyId'
// });

export default Job;