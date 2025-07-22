'use strict';

import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
      CREATE TABLE job_skills (
        job_id INT NOT NULL,
        skill_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (job_id, skill_id)
      );
    `);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS job_skills;
    `);
    }
};
