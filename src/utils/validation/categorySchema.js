import { z } from 'zod';
import { VALID_TYPES } from '../data/transactionTypes';

export const baseCategorySchema = z.object({
  name: z.string().min(2, 'Name is too short').max(50),
  type: z.enum(VALID_TYPES, {
    message: 'Please select a valid type',
  }),
  parentId: z.string().optional().nullable(),
  color: z.string().optional().nullable(),

});

export const categorySchema = baseCategorySchema
  .refine((data) => {
    // Parent Category must have a colour
    if (!data.parentId && !data.color) return false;
    return true;
  }, {
    message: 'Parent Categories require a colour',
    path: ['color']
  });

export const updateCategorySchema = baseCategorySchema
  .extend({
    type: z.enum(VALID_TYPES).optional(), // not required on edit
  })
  .refine((data) => {
    if (!data.parentId && !data.color) return false;
    return true;
  }, {
    message: 'Parent categories require a colour',
    path: ['color'],
  });
