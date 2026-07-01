import { z } from 'zod';

const validSubCategories = {
    banking: ['cash', 'chequing', 'high_interest_savings', 'savings'],
    investments: ['brokerage', 'crypto', 'gic', 'mutual_fund', 'pension', 'robo_advisor'],
    credit: ['auto_loan', 'credit_card', 'line_of_credit', 'mortgage', 'personal_loan', 'student_loan'],
};

export const accountSchema = z
    .object({
        name: z.string().min(2, 'Name is too short').max(50),
        institution: z.string().min(2, 'Institution is too short'),
        category: z.enum(['banking', 'investments', 'credit'], {
            error: 'Please select a category',
        }),
        subCategory: z.string().min(1, 'Please select a subcategory'),
        registration: z.string().min(1, 'Please select a registration type'),
    })
    .superRefine((data, ctx) => {
        const allowed = validSubCategories[data.category];

        if (!allowed || !allowed.includes(data.subCategory)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['subCategory'],
                message: 'Invalid selection',
            });
        }
    });
