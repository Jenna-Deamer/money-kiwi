import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LinkButton from '../shared/ui/buttons/LinkButton';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/overview');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <section className='flex flex-col justify-center items-center h-full'>
      <h1>Money Kiwi</h1>
      <h2>Please create an account or login to get started.</h2>
      <div className='mt-3'>
        <LinkButton to='/login'>Login</LinkButton> | <LinkButton to='/sign-up'>Sign Up</LinkButton>
      </div>
    </section>
  );
}

export default Home;
