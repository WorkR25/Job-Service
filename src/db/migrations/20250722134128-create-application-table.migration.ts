'use strict';

import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
      CREATE TABLE applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_id INT NOT NULL,
        job_id INT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS applications;
    `);
    }
};
