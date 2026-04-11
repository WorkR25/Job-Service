import {
    Association,
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';

import CompanySize from './companySize.model';
import Industry from './industry.model';
import sequelize from './sequelize';

class Company extends Model<InferAttributes<Company>,InferCreationAttributes<Company>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare logo: string;
    declare website: string;
    declare description: string;
    declare company_size_id: ForeignKey<CompanySize['id']>;
    declare industry_id: ForeignKey<Industry['id']>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date | null>;

    static associations: {
        companySize: Association<Company, CompanySize>;
        industry: Association<Company, Industry>;
    };
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
            unique: {
                name: 'unique_company_name',
                msg: 'Company with this name already exists',
            },
        },

        logo: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        website: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'unique_website',
                msg: 'Company with this website already exists',
            },
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        company_size_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: CompanySize, key: 'id' },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        },

        industry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Industry, key: 'id' },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
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
        tableName: 'companies',
        sequelize,
        underscored: true,
        timestamps: true,
    }
);

export default Company;
