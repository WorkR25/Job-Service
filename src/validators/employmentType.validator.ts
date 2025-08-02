import { z } from 'zod';

export const CreateEmploymentTypeSchema = z.object({
    name: z
        .string({ required_error: 'Employment type name is required.' })
        .min(1, { message: 'Employment type name cannot be empty.' }),
    description: z
        .string()
        .optional(),
});

export const UpdateEmploymentTypeSchema = z.object({
    id: z
        .number({ required_error: 'Employment type ID is required.' })
        .positive({ message: 'Employment type ID must be a positive number.' }),
    name: z
        .string()
        .min(1, { message: 'Employment type name cannot be empty.' })
        .optional(),
    description: z
        .string()
        .optional(),
});

export const DeleteEmploymentTypeSchema = z.object({
    id: z
        .number({ required_error: 'Employment type ID is required.' })
        .positive({ message: 'Employment type ID must be a positive number.' }),
});
