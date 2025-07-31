import { z } from 'zod';

export const CreateExperienceLevelSchema = z.object({
    name: z.string({
        required_error: 'Experience level name is required',
        invalid_type_error: 'Name must be a string',
    }).min(1, 'Name must not be empty'),

    minYears: z.number({
        required_error: 'Minimum years is required',
        invalid_type_error: 'Minimum years must be a number',
    }).int('Minimum years must be an integer').min(0, 'Minimum years must be 0 or more'),

    maxYears: z.number({
        required_error: 'Maximum years is required',
        invalid_type_error: 'Maximum years must be a number',
    }).int('Maximum years must be an integer').min(0, 'Maximum years must be 0 or more'),
});

export const UpdateExperienceLevelSchema = z.object({
    id: z.number({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a number',
    }).int('ID must be an integer'),

    name: z.string({
        invalid_type_error: 'Name must be a string',
    }).optional(),

    minYears: z.number({
        invalid_type_error: 'Minimum years must be a number',
    }).int('Minimum years must be an integer').min(0, 'Minimum years must be 0 or more').optional(),

    maxYears: z.number({
        invalid_type_error: 'Maximum years must be a number',
    }).int('Maximum years must be an integer').min(0, 'Maximum years must be 0 or more').optional(),
});

export const DeleteExperienceLevelSchema = z.object({
    id: z.number({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a number',
    }).int('ID must be an integer'),
});
