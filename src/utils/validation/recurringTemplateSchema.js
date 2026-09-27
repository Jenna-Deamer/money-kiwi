import { z } from 'zod';
import { VALID_TYPES } from '../data/transactionTypes';

export const recurringTemplateSchema = z.object({
  memo: z.string()
    .min(2, 'Memo must be at least 2 characters')
    .max(100, 'Memo cannot exceed 100 characters'),

  type: z.enum(VALID_TYPES, {
    message: 'Please select a valid type',
  }),

  amount: z.coerce.number()
    .min(0.01, 'Amount must be at least $0.01')
    .max(99999999, 'Amount cannot exceed $99,999,999'),

  accountId: z.string().uuid('Please select an account'),

  categoryId: z.string().optional().nullable(),

  toAccountId: z.string()
    .uuid('Invalid destination account')
    .optional()
    .nullable()
    .or(z.literal('')),

  // template must have a frequency
  frequency: z.enum(
    ['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'],
    { message: 'Please select a frequency' }
  ),


  startDate: z.date().or(z.string().pipe(z.coerce.date())),
  endDate: z.date().or(z.string().pipe(z.coerce.date())).optional().nullable(),
  isPaused: z.boolean().optional(),
})
  // transfers need a destination account
  .refine((data) => {
    if (data.type === 'TRANSFER' && !data.toAccountId) return false;
    return true;
  }, {
    message: 'Transfers require a destination account',
    path: ['toAccountId'],
  })
  .refine((data) => {
    if (data.type === 'TRANSFER' && data.accountId === data.toAccountId) return false;
    return true;
  }, {
    message: 'Destination must be a different account than source account',
    path: ['toAccountId'],
  })
  // non-transfer requires category
  .refine((data) => {
    if (data.type !== 'TRANSFER') {
      return !!data.categoryId && data.categoryId.trim().length > 0;
    }
    return true;
  }, {
    message: 'A category is required for income and expenses',
    path: ['categoryId'],
  })
  // endDate, if present, must be after or equal to startDate
  .refine((data) => {
    if (!data.endDate) return true;
    const start = data.startDate instanceof Date ? data.startDate : new Date(data.startDate);
    const end = data.endDate instanceof Date ? data.endDate : new Date(data.endDate);
    return end >= start;
  }, {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  });
