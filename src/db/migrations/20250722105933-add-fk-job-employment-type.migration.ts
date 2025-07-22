'use strict';

import { QueryInterface } from 'sequelize';


export default {
    async up (queryInterface: QueryInterface) {
        await queryInterface.sequelize.query(`
          ALTER TABLE jobs
          ADD CONSTRAINT fk_jobs_employment_type_id
          FOREIGN KEY (employment_type_id)
          REFERENCES employment_types(id)
          ON DELETE CASCADE;
        `);
    },

    async down (queryInterface: QueryInterface) {
        await queryInterface.sequelize.query(`
          ALTER TABLE jobs
          DROP FOREIGN KEY fk_jobs_employment_type_id;
        `);
    }
};
