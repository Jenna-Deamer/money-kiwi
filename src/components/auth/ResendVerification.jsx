import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { resendVerificationEmail } from '@/utils/api/auth';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';

function ResendVerification() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [serverError, setServerError] = useState('');
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/overview');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resendVerificationEmail(email);

      toast.success('Check your inbox!', {
        description: 'A new verification link has been sent if an account exists.'
      });

      setEmail('');
    } catch (error) {
      toast.error('Failed to resend', {
        description: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='flex flex-col items-center justify-center h-full'>
      <div className='card w-full max-w-sm'>
        <h1 className='text-center mb-1.5'>Resend Verification&nbsp;Email</h1>
        <p className='text-center'>Didn’t get the email or your link expired? Enter your address below and we’ll send a new verification&nbsp;link.</p>
        <form onSubmit={handleSubmit}>
          <FormField
            label='Email'
            htmlFor='email'
            disabled={isSubmitting}
          >
            <input
              className='input-standard'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='your@email.com'
            />
          </FormField>
          <div className='mt-4 text-center flex flex-col items-center gap-2'>
            <Button type='submit' disabled={isSubmitting} className='max-w-2'>
              {isSubmitting ? 'Sending...' : 'Send Link'}
            </Button>
            <Link to='/login' className='text-kiwi-primary underline'>Back to Login</Link>
          </div>

        </form>
      </div>

    </section>
  );
}

export default ResendVerification;
