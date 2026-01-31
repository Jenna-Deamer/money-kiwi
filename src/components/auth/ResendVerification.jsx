import { useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationEmail } from '../../utils/api/auth';

function ResendVerification() {
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
        <div className="resend-container">
            <h1>Resend Verification</h1>
            <p>Lost your link? Enter your email below.</p>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="your@email.com"
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Link'}
                </button>
            </form>
        </div>
    );
}

export default ResendVerification;