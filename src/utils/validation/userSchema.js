import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }).min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required').max(50, 'Password is too long'),
});

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password is too long'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
});