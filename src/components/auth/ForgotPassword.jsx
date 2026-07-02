import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { forgotPassword } from '@/utils/api/auth';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';

function ForgotPassword() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      toast.success('Check your inbox', {
        description: 'If an account exists with that email, a reset link has been sent.'
      });
    } catch {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <section className='flex flex-col justify-center items-center h-full'>
      <div className='card w-full max-w-md'>
        <div className='text-center mt-4'>
          <h1 className='mb-1'>Forgot your&nbsp;password?</h1>
          <p>Enter your email address and we&apos;ll send you a reset&nbsp;link.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField
            label='Email'
            htmlFor='email'
            disabled={isSubmitting}
          >
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='input-standard'
            />
          </FormField>

          <div className='text-center mb-4'>
            <Button type='submit' intent='primary' width='comfy' loadingText='Submitting...' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
