import { buttonStyles } from './ButtonStyles';

const Button = ({
    children,
    intent,
    size,
    fullWidth,
    className,
    isLoading,
    leftIcon,
    rightIcon,
    ...props
}) => {
    return (
        <button
            className={buttonStyles({ intent, size, fullWidth, className })}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                </span>
            ) : (
                <>
                    {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;