import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model} from 'sequelize';

import sequelize from './sequelize';

class JobSkill extends Model<InferAttributes<JobSkill>,InferCreationAttributes<JobSkill>> {
    declare job_id: number;
    declare skill_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

JobSkill.init(
    {
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        skill_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'job_skills',
        sequelize,
        underscored: true,
        timestamps: false,
    }
);

export default JobSkill;
