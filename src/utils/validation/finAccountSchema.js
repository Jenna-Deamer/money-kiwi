import { z } from 'zod';

export const accountSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(50),
    institution: z.string().min(2, 'Institution is too short'),
    category: z.enum(['banking', 'investments', 'credit'], {
        errorMap: () => ({ message: 'Please select a category' })
    }),
    registration: z.string().min(1, 'Please select a registration type'),
});