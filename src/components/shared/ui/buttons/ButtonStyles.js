import { tv } from 'tailwind-variants';

export const buttonStyles = tv({
  base: 'inline-flex items-center justify-center font-semibold cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-kiwi-primary focus-visible:ring-offset-2 min-w-[8rem]',    variants: {
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
          sm: 'px-3 py-1 text-xs rounded-md',
          md: 'px-4 py-2 text-sm rounded-lg',
          lg: 'px-6 py-3 text-base rounded-xl',
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
