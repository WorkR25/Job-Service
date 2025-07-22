'use strict';

import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
          ALTER TABLE applications
          ADD CONSTRAINT fk_applications_job
          FOREIGN KEY (job_id)
          REFERENCES jobs(id)
          ON DELETE CASCADE;
        `);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
          ALTER TABLE applications
          DROP FOREIGN KEY fk_applications_job;
        `);
    }
};
