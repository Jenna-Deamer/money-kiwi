import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Home() {
       const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

       // Redirect if already logged in
        useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading, navigate]);
    
    return (
        <div>
            <h1>Home Page</h1>
            <h2>Please create an account or login to get started.</h2>
            <a href='/login'>Login</a> | <a href='/sign-up'>Sign Up</a>
        </div>
    );
}

export default Home;