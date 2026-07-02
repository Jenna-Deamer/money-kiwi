import { buttonStyles } from '@/components/shared/ui/buttons/ButtonStyles';
import { Link } from 'react-router-dom';

const LinkButton = ({
  children,
  intent,
  size,
  link,
  fullWidth,
  className,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <Link
      className={buttonStyles({ intent, size, fullWidth, className })}
      to={link}
      {...props}
    >   <>
          {leftIcon && <span className='mr-2 shrink-0'>{leftIcon}</span>}
          {children}
          {rightIcon && <span className='ml-2 shrink-0'>{rightIcon}</span>}
        </>

    </Link>
  );
};
export default LinkButton;
