import LinkButton from '@/components/shared/ui/buttons/LinkButton';

function Error() {
  return (
    <section className='flex flex-col items-center justify-center h-screen'>
      <div className='card w-full max-w-md text-center'>
        <h1 className='mb-1 text-center'>Something went&nbsp;wrong</h1>
        <p>We couldn't load this&nbsp;page.</p>
        <div className='mt-4'>
          <LinkButton to='/'>Go to Overview</LinkButton>
        </div>
      </div>
    </section>
  );
}

export default Error;
