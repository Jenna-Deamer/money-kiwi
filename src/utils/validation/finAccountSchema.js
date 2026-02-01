import { z } from 'zod';

export const accountSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(50),
    institution: z.string().min(2, 'Institution is too short'),
    category: z.enum(['banking', 'investments', 'credit'], {
        errorMap: () => ({ message: 'Please select a category' })
    }),
    subCategory: z.enum(['cash', 'chequing', 'high_interest_savings', 'savings', 'brokerage', 'crypto', 'gic', 'mutual_fund', 'pension', 'robo_advisor', 'auto_loan', 'credit_card', 'line_of_credit', 'mortgage', 'personal_loan', 'student_loan'], {
        errorMap: () => ({ message: 'Please select a sub-category' })
    }),
    registration: z.string().min(1, 'Please select a registration type'),
});