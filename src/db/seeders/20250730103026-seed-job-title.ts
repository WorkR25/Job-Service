import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        const timestamp = new Date();

        await queryInterface.bulkInsert('job_titles', [
            { title: 'Software Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'Frontend Developer', created_at: timestamp, updated_at: timestamp },
            { title: 'Backend Developer', created_at: timestamp, updated_at: timestamp },
            { title: 'Full Stack Developer', created_at: timestamp, updated_at: timestamp },
            { title: 'Data Scientist', created_at: timestamp, updated_at: timestamp },
            { title: 'DevOps Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'Product Manager', created_at: timestamp, updated_at: timestamp },
            { title: 'UI/UX Designer', created_at: timestamp, updated_at: timestamp },
            { title: 'Mobile Developer', created_at: timestamp, updated_at: timestamp },
            { title: 'QA Engineer', created_at: timestamp, updated_at: timestamp },


            { title: 'Security Analyst', created_at: timestamp, updated_at: timestamp },
            { title: 'Machine Learning Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'Site Reliability Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'Cloud Architect', created_at: timestamp, updated_at: timestamp },
            { title: 'Business Analyst', created_at: timestamp, updated_at: timestamp },
            { title: 'Technical Support Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'Solutions Architect', created_at: timestamp, updated_at: timestamp },
            { title: 'Data Analyst', created_at: timestamp, updated_at: timestamp },
            { title: 'AI Researcher', created_at: timestamp, updated_at: timestamp },
            { title: 'Blockchain Developer', created_at: timestamp, updated_at: timestamp },
            { title: 'Embedded Systems Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'CRM Specialist', created_at: timestamp, updated_at: timestamp },
            { title: 'IT Project Manager', created_at: timestamp, updated_at: timestamp },
            { title: 'Technical Writer', created_at: timestamp, updated_at: timestamp },
            { title: 'Network Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'Systems Administrator', created_at: timestamp, updated_at: timestamp },
            { title: 'Game Developer', created_at: timestamp, updated_at: timestamp },
            { title: 'Penetration Tester', created_at: timestamp, updated_at: timestamp },
            { title: 'Computer Vision Engineer', created_at: timestamp, updated_at: timestamp },
            { title: 'API Developer', created_at: timestamp, updated_at: timestamp },
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('job_titles', {
            title: [
                'Software Engineer',
                'Frontend Developer',
                'Backend Developer',
                'Full Stack Developer',
                'Data Scientist',
                'DevOps Engineer',
                'Product Manager',
                'UI/UX Designer',
                'Mobile Developer',
                'QA Engineer',

                'Security Analyst',
                'Machine Learning Engineer',
                'Site Reliability Engineer',
                'Cloud Architect',
                'Business Analyst',
                'Technical Support Engineer',
                'Solutions Architect',
                'Data Analyst',
                'AI Researcher',
                'Blockchain Developer',
                'Embedded Systems Engineer',
                'CRM Specialist',
                'IT Project Manager',
                'Technical Writer',
                'Network Engineer',
                'Systems Administrator',
                'Game Developer',
                'Penetration Tester',
                'Computer Vision Engineer',
                'API Developer',
            ],
        });
    },
};
