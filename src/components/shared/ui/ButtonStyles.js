import { tv } from 'tailwind-variants';

export const buttonStyles = tv({
    base: 'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-kiwi-primary focus-visible:ring-offset-2',
    variants: {
        intent: {
            primary: 'bg-kiwi-primary !text-white hover:bg-kiwi-dark shadow-sm',
            secondary:
                'bg-canvas-card text-txt-main border border-border-soft hover:bg-border-soft',
            income: 'bg-income !text-white hover:opacity-90',
            expense: 'bg-expense !text-white hover:opacity-90',
            ghost:
                'bg-transparent text-txt-muted hover:text-txt-main hover:bg-border-soft',
        },
        size: {
            sm: 'px-3 py-0.5 text-xs rounded-md',
            md: 'px-4 py-1.5 text-small rounded-lg',
            lg: 'px-8 py-2.5 text-body rounded-xl',
        },
        fullWidth: {
            true: 'w-full',
        },
    },
    defaultVariants: {
        intent: 'primary',
        size: 'md',
    },
});
