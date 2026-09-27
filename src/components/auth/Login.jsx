import { useAccounts } from '@/hooks/useAccounts';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi } from '@/utils/api/auth';
import { demoSession as demoApi } from '@/utils/api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validation/userSchema';
import { toast } from 'sonner';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();
  const { data: accounts, isLoading: accountsIsLoading, isSuccess, isError } = useAccounts();
  const hasAccounts = accounts && accounts.length > 0;
  const [serverError, setServerError] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  useEffect(() => {
    if (accountsIsLoading) return;
    if (isError || (!isLoading && isAuthenticated && hasAccounts && isSuccess)) navigate('/overview');
    if (!isLoading && isAuthenticated && !hasAccounts && isSuccess && !isError) navigate('/accounts');
  }, [isAuthenticated, isLoading, navigate, hasAccounts, accountsIsLoading, isError, isSuccess]);


  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setServerError('');

    try {
      const email = data.email.toLowerCase();
      const response = await loginApi(email, data.password);
      login(response.token);

      toast.success('Welcome back', {
        description: 'Login successful.',
        duration: 4000
      });

    } catch (error) {
      setServerError(error.message);
    }
  };

  const demoLogin = async () => {
    setServerError('');
    setIsDemoLoading(true);
    try {
      const response = await demoApi();
      login(response.token);
      setIsDemoLoading(false);

    } catch (error) {
      setServerError(error.message);
      setIsDemoLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return null;
  }


  return (
    <section className='flex flex-col items-center justify-center h-full'>
      <div className='card w-full max-w-sm'>
        <h1 className='mb-2 text-center'>Login</h1>

        {serverError && (
          <div className='form-error' role='alert'>
            <p>{serverError}</p>
            {serverError.toLowerCase().includes('verified') && (
              <Link
                to='/resend-verification'
                className='text-xs underline'
              >
                Didn't get the email? Click here to resend.
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className='border-none p-0 m-0'>
            <legend className='sr-only'>Credentials</legend>

            <FormField
              label='Email'
              htmlFor='email'
              error={errors.email?.message}
              disabled={isSubmitting}
            >
              <input
                id='email'
                {...register('email')}
                placeholder='email@somewhere.com'
                className='input-standard'
              />
            </FormField>

            <FormField
              label='Password'
              htmlFor='password'
              error={errors.password?.message}
              disabled={isSubmitting}
            >
              <input
                id='password'
                type='password'
                {...register('password')}
                placeholder='********'
                className='input-standard'
              />
            </FormField>

            <div className='mt-6 flex justify-center'>
              <Button
                type='submit'
                intent='primary'
                loadingText='Logging in...'
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </div>
          </fieldset>
        </form>

        <div className='mt-4 space-y-1 text-small text-txt-muted text-center'>
          <p>
            Don&apos;t have an&nbsp;account?{' '}
            <Link to='/sign-up' className='text-kiwi-primary underline'>
              Sign&nbsp;up
            </Link>
          </p>

          <p>
            <Link to='/forgot-password' className='text-kiwi-primary underline'>
              Forgot&nbsp;password?
            </Link>
          </p>
        </div>

        <div className='my-5 flex items-center gap-3'>
          <div className='h-px flex-1 bg-soft' />
          <span className='text-small text-txt-muted'>or</span>
          <div className='h-px flex-1 bg-soft' />
        </div>

        <div className='text-center'>
          <Button
            type='button'
            intent='subtle'
            onClick={demoLogin}
            isLoading={isDemoLoading}
            loadingText='Loading Demo...'
          >
            Try Demo
          </Button>

          <p className='mt-2 text-xs text-txt-muted'>
            Temporary demo session with sample data.
            <br />
            No signup&nbsp;required.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
