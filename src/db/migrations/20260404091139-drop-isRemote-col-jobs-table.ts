'use strict';

import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
          ALTER TABLE jobs
          DROP COLUMN is_remote;
        `);
    },


    down: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
          ALTER TABLE jobs
          ADD COLUMN is_remote BOOLEAN NOT NULL DEFAULT FALSE;
        `);
    }
};
