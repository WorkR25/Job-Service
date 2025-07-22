'use strict';

import { QueryInterface } from 'sequelize';


export default {
    async up (queryInterface: QueryInterface) {
        await queryInterface.sequelize.query(`
            CREATE TABLE jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title_id INT,
                employment_type_id INT,
                experience_level_id INT,
                salary_min DECIMAL(10, 2) NOT NULL,
                salary_max DECIMAL(10, 2) NOT NULL,
                recuiter_id INT,
                company_id INT,
                city_id INT,
                is_remote BOOLEAN NOT NULL DEFAULT FALSE,
                apply_link VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME DEFAULT NULL
            );`
        );
    },

    async down (queryInterface: QueryInterface) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS jobs;
        `);
    }
};
