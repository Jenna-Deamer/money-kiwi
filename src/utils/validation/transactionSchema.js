import { z } from 'zod';

export const transactionBaseSchema = z.object({
    memo: z.string()
        .min(2, 'Memo must be at least 2 characters')
        .max(100, 'Memo cannot exceed 100 characters'),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER'], {
        message: 'Please select a valid type',
    }),
    amount: z.coerce.number()
        .min(0.01, 'Amount must be at least $0.01')
        .max(99999999, 'Amount cannot exceed $99,999,999'),
    date: z.date().or(z.string().pipe(z.coerce.date())),
    category: z.string().optional().nullable(),
    accountId: z.string().uuid('Please select an account'),
    toAccountId: z.string().uuid('Invalid destination account').optional().nullable().or(z.literal('')),
});

export const transactionSchema = transactionBaseSchema
    .refine((data) => {
        // Transfer must have a destination
        if (data.type === 'Transfer' && !data.toAccountId) return false;
        return true;
    }, {
        message: 'Transfers require a destination account',
        path: ['toAccountId']
    })
    .refine((data) => {
        // Prevent "Self-Transfers"
        if (data.type === 'Transfer' && data.accountId === data.toAccountId) return false;
        return true;
    }, {
        message: 'Destination must be a different account than source account',
        path: ['toAccountId']
    })
    .refine((data) => {
        // Category required for Income/Expense
        if (data.type !== 'Transfer' && data.type !== undefined) {
            return !!data.category && data.category.trim().length > 0;
        }
        return true;
    }, {
        message: 'A category is required for income and expenses',
        path: ['category']
    });
