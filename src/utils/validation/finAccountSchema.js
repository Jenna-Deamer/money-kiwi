import { z } from 'zod';

export const accountSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    insutiution: z.string().min(2, "Insutiution must be at least 2 characters"),
    type: z.string().min(1, "Type is required"),
    registration: z.string().min(1, "Registration is required"),
});