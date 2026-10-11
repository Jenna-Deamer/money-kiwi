import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { demoSession } from '@/utils/api/auth';
import { toast } from 'sonner';
import LinkButton from '../shared/ui/buttons/LinkButton';
import Button from '../shared/ui/buttons/Button';
import { Landmark, Folders, Repeat, ChartBar, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Landmark,
    title: 'Accounts',
    body: 'All your accounts in one place.',
  },
  {
    icon: Folders,
    title: 'Categories',
    body: 'Colour-coded categories for your spending.',
  },
  {
    icon: Repeat,
    title: 'Recurring',
    body: 'Bills and paycheques added for you.',
  },
  {
    icon: ChartBar,
    title: 'Dashboard',
    body: 'See your cash flow at a glance.',
  },
];

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/overview');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const demoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const response = await demoSession();
      login(response.token);
    } catch (error) {
      toast.error(error.message || 'Could not start the demo. Please try again.');
      setIsDemoLoading(false);
    }
  };

  return (
    <div className='mx-auto flex max-w-6xl flex-col items-center gap-14 py-8 text-center md:py-16'>
      <div className='max-w-xl'>
        <h1 className='text-4xl md:text-5xl'>Money Kiwi</h1>
        <p className='mt-4 text-lg text-txt-muted'>
          A simple way to track your accounts and spending.
        </p>
      </div>

      <div className='grid w-full gap-6 text-left sm:grid-cols-2 lg:grid-cols-4'>
        {features.map((feature) => (
          <div key={feature.title} className='card-compact flex flex-col gap-3'>
            <span className='flex h-11 w-11 items-center justify-center rounded-lg bg-kiwi-soft text-kiwi-primary'>
              <feature.icon aria-hidden='true' className='icon-lg' />
            </span>
            <h3>{feature.title}</h3>
            <p className='text-small text-txt-muted'>{feature.body}</p>
          </div>
        ))}
      </div>

      <div className='flex flex-wrap justify-center gap-3'>
        <LinkButton to='/sign-up' size='lg' rightIcon={<ArrowRight className='icon-md' />}>
          Get started
        </LinkButton>
        <Button
          intent='subtle'
          size='lg'
          isLoading={isDemoLoading}
          loadingText='Starting demo...'
          onClick={demoLogin}
        >
          Try demo
        </Button>
        <LinkButton to='/login' size='lg' intent='subtle'>
          Login
        </LinkButton>
      </div>
    </div>
  );
}

export default Home;
