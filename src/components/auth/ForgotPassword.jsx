import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { toast } from 'sonner';
import { forgotPassword } from "../../utils/api/auth";

function ForgotPassword() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already logged in
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
            toast.success("Check your inbox", {
                description: "If an account exists with that email, a reset link has been sent."
            });
        } catch {
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div>
            <h1>Forgot Password</h1>
            <p>Enter your email address to receive a password reset link.</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type='email'
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword;