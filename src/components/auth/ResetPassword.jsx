import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { resetPassword } from '@/utils/api/auth';
import { resetPasswordSchema } from '@/utils/validation/userSchema';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data) => {
        if (!token) {
            return toast.error('Reset token is missing. Please request a new link.');
        }

        try {
            await resetPassword(token, data.password);
            toast.success('Password updated successfully!');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Failed to reset password.');
        }
    };

    if (!token) {
        return (
            <section className='flex flex-col items-center justify-center h-full'>
                <div className='card w-full max-w-sm text-center'>
                    <h1 className='my-4'>Invalid Access</h1>
                    <p>This page requires a valid reset token. Please request a new link.</p>
                    <div className='mt-4'>
                        <LinkButton to='/forgot-password'>Request Reset Link</LinkButton>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className='flex flex-col items-center justify-center h-full'>
            <div className='card w-full max-w-sm'>
                <h1 className='text-center my-4'>Create New Password</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                        label='New Password'
                        htmlFor='password'
                        error={errors.password?.message}
                    >
                        <input
                            type='password'
                            {...register('password')}
                            placeholder='New password'
                            className='input-standard'
                        />
                    </FormField>

                    <FormField
                        label='Confirm New Password'
                        htmlFor='confirmPassword'
                        error={errors.confirmPassword?.message}
                    >
                        <input
                            type='password'
                            {...register('confirmPassword')}
                            placeholder='Confirm new password'
                            className='input-standard'
                        />
                    </FormField>

                    <div className='text-center my-4'>
                        <Button type='submit' intent='primary' loadingText='Updating...' isLoading={isSubmitting}>
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ResetPassword;