import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner';
import { resetPassword } from '../../utils/api/auth';
import { resetPasswordSchema } from '../../utils/validation/validationSchema';

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
            return toast.error("Reset token is missing. Please request a new link.");
        }

        try {
            await resetPassword(token, data.password);
            toast.success("Password updated successfully!");
            navigate('/login');
        } catch (err) {
            toast.error(err.message || "Failed to reset password.");
        }
    };

    if (!token) {
        return (
            <div className="error-container">
                <h2>Invalid Access</h2>
                <p>This page requires a valid reset token. Please request a new link.</p>
                <Link to="/forgot-password">Request Reset Link</Link>
            </div>
        );
    }
    return (
        <div className="auth-container">
            <h1>Create New Password</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="New Password"
                        {...register("password")}
                    />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;