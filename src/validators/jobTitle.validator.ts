import { z } from 'zod';

export const DeleteJobTitleSchema = z.object({
    id: z.number({
        required_error: 'Job title ID is required',
        invalid_type_error: 'Job title ID must be a number',
    }),
});

export const UpdateJobTitleSchema = z.object({
    id: z.number({
        required_error: 'Job title ID is required',
        invalid_type_error: 'Job title ID must be a number',
    }),
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
    }),
});

export const CreateJobTitleSchema = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
    }),
});
