import { z } from 'zod';

export const accountSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    institution: z.string().min(2, 'Institution must be at least 2 characters').max(50, 'Institution must be at most 50 characters'),
    category: z.string().min(1, 'Type is required'),
    registration: z.string().min(1, 'Registration is required'),
});