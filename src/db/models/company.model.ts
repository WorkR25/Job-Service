import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';

import sequelize from './sequelize';

class Company extends Model<InferAttributes<Company>,InferCreationAttributes<Company>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare website: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date | null>;
}

Company.init(
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
        website: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            unique: true,
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
        tableName: 'companies',
        sequelize,
        underscored: true,
        timestamps: false,
    }
);

export default Company;
