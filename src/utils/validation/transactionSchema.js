import { z } from 'zod';

export const transactionSchema = z.object({
    memo: z.string()
        .min(2, 'Memo must be at least 2 characters')
        .max(100, 'Memo cannot exceed 100 characters'),
    type: z.enum(['Income', 'Expense', 'Transfer'], {
        errorMap: () => ({ message: 'Please select a valid type' })
    }),
    amount: z.number()
        .min(0.01, 'Amount must be at least $0.01')
        .max(99999999, 'Amount cannot exceed $99,999,999'),
    date: z.date().or(z.string().pipe(z.coerce.date())),
    category: z.string().optional().nullable(),
    status: z.enum(['POSTED', 'PENDING_MATCH', 'UPCOMING']).default('POSTED'),
    accountId: z.string().uuid('Invalid account ID'),
    direction: z.enum(['INCOMING', 'OUTGOING']).optional().nullable(),
    toAccountId: z.string().uuid('Invalid destination account').optional().nullable(),
}).refine((data) => {
    // A transfer must have a destination
    if (data.type === 'Transfer' && !data.toAccountId) {
        return false;
    }
    return true;
}, {
    message: 'Transfers require a destination account',
    path: ['toAccountId']
}).refine((data) => {
    // If it's not a transfer, category must exist and not be empty
    if (data.type !== 'Transfer') {
        return !!data.category && data.category.trim().length > 0;
    }
    return true;
}, {
    message: 'Category is required for income and expenses',
    path: ['category']
});