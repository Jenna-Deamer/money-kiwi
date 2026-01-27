import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { login as loginApi } from '../../utils/api/auth';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/validation/validationSchema";
import { toast } from 'sonner';

function Login() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, login } = useAuth();
    const [serverError, setServerError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading, navigate]);


    // Initialize Hook Form
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
                description: 'Login successful.'
            });

            navigate('/dashboard');
        } catch (err) {
            toast.error('Login Failed', {
                description: err.message
            });
            setServerError(err.message);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <>
            <h1>Login</h1>
            {serverError && (
                <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#fff5f5', border: '1px solid red' }}>
                    <p>{serverError}</p>
                    {/* Check if the error is about verification to show a helper link */}
                    {serverError.toLowerCase().includes('verified') && (
                        <Link to="/resend-verification" style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>
                            Didn't get the email? Click here to resend.
                        </Link>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting} style={{ border: 'none', padding: 0, margin: 0 }}>
                    <legend style={{ display: 'none' }}>Credentials</legend>

                    <div className="input-group">
                        <input {...register("email")} placeholder="Email" />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>

                    <div className="input-group">
                        <input type="password" {...register("password")} placeholder="Password" />
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>

                    <button type="submit">
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </fieldset>
            </form>

            <p>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
            <p>Forgot your password? <Link to="/forgot-password">Reset Password</Link></p>
        </>
    );
}

export default Login;