import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { signup as signupApi } from '@/utils/api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/utils/validation/userSchema';
import { toast } from 'sonner';
import Button from '@/components/shared/ui/Button';

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
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div>
            <h1>Sign Up</h1>
            {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset
                    disabled={isSubmitting}
                    style={{ border: 'none', padding: 0 }}
                >
                    <legend style={{ display: 'none' }}>User Registration</legend>

                    <div className="input-group">
                        <input {...register('name')} placeholder="Name" />
                        {errors.name && (
                            <span className="error">{errors.name.message}</span>
                        )}
                    </div>

                    <div className="input-group">
                        <input {...register('email')} placeholder="Email" />
                        {errors.email && (
                            <span className="error">{errors.email.message}</span>
                        )}
                    </div>

                    <fieldset style={{ border: 'none', padding: '10px 0', margin: 0 }}>
                        <legend className="sr-only">Password Security</legend>

                        <div className="input-group">
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="Password"
                            />
                            {errors.password && (
                                <span className="error">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                placeholder="Confirm password"
                            />
                            {errors.confirmPassword && (
                                <span className="error">{errors.confirmPassword.message}</span>
                            )}
                        </div>
                    </fieldset>
                    <Button type="submit" intent="primary" loadingText="Creating Account..." isLoading={isSubmitting}>
                        Sign Up
                    </Button>
                </fieldset>
            </form>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default SignUp;
