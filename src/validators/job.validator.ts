
import { z } from 'zod';

export const GetJobByQuerySchema = z.object({
    title_id: z.string().regex(/^\d+$/, 'Title ID must be a valid number').optional(),
    employment_type_id: z.string().regex(/^\d+$/, 'Employment Type ID must be a valid number').optional(),
    experience_level_id: z.string().regex(/^\d+$/, 'Experience Level ID must be a valid number').optional(),
    salary_min: z.string().regex(/^\d+$/, 'Minimum salary must be a valid number').optional(),
    salary_max: z.string().regex(/^\d+$/, 'Maximum salary must be a valid number').optional(),
    recruiter_id: z.string().regex(/^\d+$/, 'Recruiter ID must be a valid number').optional(),
    company_id: z.string().regex(/^\d+$/, 'Company ID must be a valid number').optional(),
    city_id: z.string().regex(/^\d+$/, 'City ID must be a valid number').optional(),
    is_remote: z.enum(['true', 'false']).optional(),
    apply_link: z.string().url('Apply link must be a valid URL').optional(),
}).strict();

export const CreateJobSchema = z.object({
    title_id: z.number({ required_error: 'Title ID is required' }),
    employment_type_id: z.number({ required_error: 'Employment Type ID is required' }),
    experience_level_id: z.number({ required_error: 'Experience Level ID is required' }),
    salary_min: z.number({ required_error: 'Minimum salary is required' }),
    salary_max: z.number({ required_error: 'Maximum salary is required' }),
    recuiter_id: z.number({ required_error: 'Recruiter ID is required' }),
    company_id: z.number({ required_error: 'Company ID is required' }),
    city_id: z.number({ required_error: 'City ID is required' }),
    is_remote: z.boolean({ required_error: 'Remote status is required' }),
    apply_link: z.string({ required_error: 'Apply link is required' }).url('Apply link must be a valid URL'),
    skillIds: z.array(z.number({required_error: 'Skill Ids must be a number '}))
});

export const DeleteJobSchema= z.object({
    id: z.number({ required_error: 'ID is required' }),
});


export const UpdateJobSchema = z.object({
    id: z.number({ required_error: 'ID is required' }),
    title_id: z.number().optional(),
    employment_type_id: z.number().optional(),
    experience_level_id: z.number().optional(),
    salary_min: z.number().optional(),
    salary_max: z.number().optional(),
    recuiter_id: z.number().optional(),
    company_id: z.number().optional(),
    city_id: z.number().optional(),
    is_remote: z.boolean().optional(),
    apply_link: z.string().url('Apply link must be a valid URL').optional(),
});
