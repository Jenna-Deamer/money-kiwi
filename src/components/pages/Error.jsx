import LinkButton from '@/components/shared/ui/buttons/LinkButton';

function Error() {
    return (
        <section className='flex flex-col items-center justify-center h-full'>
            <div className='card w-full max-w-sm text-center'>
                <h1 className='my-4'>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
                <div className='mt-4'>
                    <LinkButton to='/'>Go to Home</LinkButton>
                </div>
            </div>
        </section>
    );
}

export default Error;