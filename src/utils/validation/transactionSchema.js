import { z } from 'zod';

export const transactionSchema = z.object({
    name: z.string().min(2, 'Memo is too short').max(100, 'Memo is too long'),

    type: z.enum(['income', 'expense', 'transfer'], {
        errorMap: () => ({ message: 'Please select a valid type' })
    }),
    amount: z.number()
        .min(0.01, 'Amount must be at least $0.01')
        .max(99999999, 'Amount cannot exceed $99,999,999'),
    date: z.date().or(z.string().pipe(z.coerce.date())),
    status: z.enum(['POSTED', 'PENDING_MATCH', 'UPCOMING']).default('POSTED'),

    // Logic for Transfers
    accountId: z.string().uuid('Invalid account ID'),
    toAccountId: z.string().uuid('Invalid destination account').optional().nullable(),
}).refine((data) => {
    // a transfer must have a destination
    if (data.type === 'transfer' && !data.toAccountId) {
        return false;
    }
    return true;
}, {
    message: 'Transfers require a destination account',
    path: ['toAccountId']
});