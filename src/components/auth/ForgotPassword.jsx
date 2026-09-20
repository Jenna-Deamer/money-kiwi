import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { forgotPassword } from '@/utils/api/auth';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';

function ForgotPassword() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      toast.success('Check your inbox', {
        description: 'If an account exists with that email, a reset link has been sent.'
      });
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
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
        <div className='text-center mb-2'>
          <h1 className='mb-1'>Forgot your&nbsp;password?</h1>
          <p>Enter your email address and we&apos;ll send you a reset&nbsp;link.</p>
        </div>

        {error && (
          <div className='form-error'>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label='Email'
            htmlFor='email'
            disabled={isSubmitting}
          >
            <input
              id='email'
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='input-standard'
            />
          </FormField>

          <div className='mt-6 flex justify-center'>
            <Button type='submit' intent='primary' isLoading={isSubmitting} loadingText='Submitting...'>
              Send Reset Link
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
