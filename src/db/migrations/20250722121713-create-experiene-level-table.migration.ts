'use strict';

import { QueryInterface } from 'sequelize';


export default {
    async up (queryInterface: QueryInterface) {
        await queryInterface.sequelize.query(`
          CREATE TABLE experience_levels (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            min_years INT NOT NULL,
            max_years INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at DATETIME DEFAULT NULL
          );
        `);
    },

    async down (queryInterface: QueryInterface) {
        await queryInterface.sequelize.query(`
          DROP TABLE IF EXISTS experience_levels;
        `);
    }
};
