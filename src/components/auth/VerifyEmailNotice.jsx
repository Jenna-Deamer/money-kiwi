import Button from '@/components/shared/ui/buttons/Button';

function VerifyEmailNotice() {
    return (
        <section className='flex flex-col items-center justify-center h-full'>
            <div className='card w-full max-w-sm text-center'>
                <h1 className='mb-6 text-center'>Verify your Email</h1>
                <p>You're almost there! Please check your inbox and click the link to unlock all features.</p>
                <div className='mt-6'>
                    <Button onClick={() => window.location.reload()}>I've verified, let me in!</Button>
                </div>
            </div>
        </section>
    );
}

export default VerifyEmailNotice;