'use strict';

import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
          ALTER TABLE company_cities
          RENAME COLUMN city_id TO location_id;
        `);
    },


    down: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
          ALTER TABLE company_cities
          RENAME COLUMN location_id TO city_id;
        `);
    }
};
