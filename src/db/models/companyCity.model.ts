import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';

import sequelize from './sequelize';

class CompanyCity extends Model<InferAttributes<CompanyCity>,InferCreationAttributes<CompanyCity>> {
    declare company_id: number;
    declare city_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CompanyCity.init(
    {
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        city_id: {
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
        tableName: 'company_cities',
        sequelize,
        underscored: true,
        timestamps: false,
    }
);

export default CompanyCity;
