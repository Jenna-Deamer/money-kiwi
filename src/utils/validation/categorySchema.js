import { z } from 'zod';

export const baseCategorySchema = z.object({
    name: z.string().min(2, 'Name is too short').max(50),
    type: z.enum(['INCOME', 'EXPENSE'], {
        message: 'Please select a valid type',
    }),
    parentId: z.string().optional().nullable(),
    color: z.string().optional().nullable(),

});

export const categorySchema = baseCategorySchema
    .refine((data) => {
        // Parent Category must have a color
        if (!data.parentId && !data.color) return false;
        return true;
    }, {
        message: 'Parent Categoires require a color',
        path: ['color']
    });

export const updateCategorySchema = baseCategorySchema
    .extend({
        type: z.enum(['INCOME', 'EXPENSE']).optional(), // not required on edit
    })
    .refine((data) => {
        if (!data.parentId && !data.color) return false;
        return true;
    }, {
        message: 'Parent categories require a color',
        path: ['color'],
    });