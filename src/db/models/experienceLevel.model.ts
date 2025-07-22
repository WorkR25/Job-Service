import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';

import sequelize from './sequelize';

class ExperienceLevel extends Model<InferAttributes<ExperienceLevel>,InferCreationAttributes<ExperienceLevel>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare minYears: number;
    declare maxYears: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date | null>;
}

ExperienceLevel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        minYears: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxYears: {
            type: DataTypes.INTEGER,
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
    },
    {
        tableName: 'experience_levels',
        sequelize,
        underscored: true,
        timestamps: false,
    }
);

export default ExperienceLevel;
