import { Association, CreationOptional,  DataTypes,  ForeignKey,  InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';

import Company from './company.model';
import EmploymentType from './employmentType.model';
import ExperienceLevel from './experienceLevel.model';
import JobTitle from './jobTitle.model';
import sequelize from './sequelize';

class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
    declare id: CreationOptional<number>;
    declare title_id: ForeignKey<JobTitle['id']>;
    declare employment_type_id: ForeignKey<EmploymentType['id']>;
    declare experience_level_id: ForeignKey<ExperienceLevel['id']>;
    declare salary_min: number;
    declare salary_max: number;
    declare recruiter_id: number;
    declare company_id: ForeignKey<Company['id']>;
    declare location_id: number;
    declare apply_link: string;
    declare description: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date | null>;

    declare jobTitle?: NonAttribute<JobTitle>;
    declare employmentType?: NonAttribute<EmploymentType>;
    declare experienceLevel?: NonAttribute<ExperienceLevel>;
    declare company?: NonAttribute<Company>;

    static associations: {
        jobTitle: Association<Job, JobTitle>;
        employmentType: Association<Job, EmploymentType>;
        experienceLevel: Association<Job, ExperienceLevel>;
        company: Association<Job, Company>;
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
        allowNull: false,
        references: { model: JobTitle, key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    employment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: EmploymentType, key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    experience_level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: ExperienceLevel, key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    salary_min: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    salary_max: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    recruiter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Company, key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    apply_link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'unique_apply_link',
            msg: 'Job with this apply link already exists',
        },
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},
{
    tableName: 'jobs',
    sequelize,
    underscored: true,
    timestamps: true,
}
);

export default Job;