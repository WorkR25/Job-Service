import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';

import Job from './job.model';
import sequelize from './sequelize';

class Application extends Model<InferAttributes<Application>,InferCreationAttributes<Application>> {
    declare id: CreationOptional<number>;
    declare candidate_id: number;
    declare job_id: ForeignKey<Job['id']>;
    declare applied_at: CreationOptional<Date>;
}

Application.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        candidate_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references : {
                model: Job,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        applied_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'applications',
        underscored: true,
        timestamps: false,
    }
);

export default Application;
