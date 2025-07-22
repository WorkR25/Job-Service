import { CreationOptional,  DataTypes,  ForeignKey,  InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import Company from './company.model';
import EmploymentType from './employmentType.model';
import JobTitle from './jobTitle.model';
import sequelize from './sequelize';

class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>>{
    declare id: CreationOptional<number>;
    declare title_id: ForeignKey<JobTitle['id']>;
    declare employment_type_id: ForeignKey<EmploymentType['id']>;
    declare experience_level_id: CreationOptional<number>;
    declare salary_min: number;
    declare salary_max: number;
    declare recuiter_id: CreationOptional<number>;
    declare company_id: ForeignKey<Company['id']>;
    declare city_id: CreationOptional<number>;
    declare is_remote: boolean;
    declare apply_link: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date | null>;

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
    },
    salary_min: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    salary_max: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    recuiter_id: {
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

export default Job;