import { Link, useNavigate } from 'react-router-dom';
import { useState} from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

function Nav() {
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Farewell', {
      description: 'You have been signed out successfully.'
    });


    navigate('/login');
  };

  if (!isAuthenticated) return null;
  return (
    <nav className='border-r p-2 min-h-screen'>
      <button className='mb-4' onClick={() => setIsCollapsed(true)}>Close</button>
      <ul className='flex flex-col gap-2'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="accounts">Accounts</Link></li>
        <li><Link to="transactions">Transactions</Link></li>
        <li><Link to="recurring">Recurring</Link></li>
        <li><Link to='categories'>Categories</Link></li>
      </ul>
      <div className=''>
        <button>Settings</button><br/>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Nav;
