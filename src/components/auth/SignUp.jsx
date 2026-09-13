import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { signup as signupApi } from '@/utils/api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/utils/validation/userSchema';
import { toast } from 'sonner';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';

function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [serverError, setServerError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Initialize Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const email = data.email.toLowerCase();
    try {
      await signupApi(data.name, email, data.password, data.confirmPassword);
      toast.success('Account created', {
        description: 'Check your email to verify your account.',
      });
      navigate('/login');
    } catch (err) {
      toast.error('Sign Up Failed');
      setServerError(err.message);
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
        <h1 className='mb-2 text-center'>Sign Up</h1>
        {serverError && (
          <div className='form-error'>
            <p>{serverError}</p></div>)}



        <form onSubmit={handleSubmit(onSubmit)}>
          <legend style={{ display: 'none' }}>Create Account</legend>
          <FormField
            label='Name'
            htmlFor='name'
            error={errors.name?.message}
            disabled={isSubmitting}
          >
            <input {...register('name')} placeholder='Name' className='input-standard' />
          </FormField>
          <FormField
            label='Email'
            htmlFor='email'
            error={errors.email?.message}
            disabled={isSubmitting}
          >
            <input {...register('email')} placeholder='email@somewhere.com' className='input-standard' />
          </FormField>
          <fieldset
            disabled={isSubmitting}
            className='border-none p-0'
          >

            <FormField
              label='Password'
              htmlFor='password'
              error={errors.password?.message}
              disabled={isSubmitting}
            >
              <input
                type='password'
                {...register('password')}
                placeholder='********'
                className='input-standard'
              />
            </FormField>
            <FormField
              label='Confirm Password'
              htmlFor='confirmPassword'
              error={errors.confirmPassword?.message}
              disabled={isSubmitting}
            >
              <input
                type='password'
                {...register('confirmPassword')}
                placeholder='Confirm password'
                className='input-standard'
              />
            </FormField>

            <div className='mt-6 flex justify-center'>
              <Button type='submit' intent='primary' loadingText='Creating Account...' isLoading={isSubmitting}>
                Sign Up
              </Button>
            </div>
          </fieldset>
        </form>
        <div className='mt-4 text-small text-txt-muted text-center'>
          <p>
            Already have an&nbsp;account? <Link to='/login' className='text-kiwi-primary underline'>Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
