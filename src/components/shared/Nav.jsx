import { Link, useNavigate } from 'react-router-dom';
import { useState} from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { House,ChartBar, Receipt, Repeat,Landmark,Folders,Upload, Settings,LogOut, ArrowRight, ArrowLeft} from 'lucide-react';

function Nav() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Farewell', {
      description: 'You have been signed out successfully.'
    });
    navigate('/login');
  };

  const toggleNav= () => {
    setIsCollapsed(prevIsCollapsed => !prevIsCollapsed)

    if (isCollapsed === true) {
      //
    } else {
      //
    }
  };


  if (!isAuthenticated) return null;
  return (
    <nav
      className={`sidebar transition-[width] duration-200
        ${isCollapsed ? 'w-16' : 'w-56'}`}
    >
      <button className='mb-4' onClick={toggleNav}>{isCollapsed ? <ArrowRight /> : <ArrowLeft />}</button>
      <ul className='flex flex-col gap-2'>
        <li><Link to="/"><House /><span className={isCollapsed ? 'sr-only' : 'inline'}>Home</span></Link></li>
        <li><Link to="accounts"><Landmark/><span className={isCollapsed ? 'sr-only' : 'inline'}>Accounts</span></Link></li>
        <li><Link to="transactions"><Receipt/><span className={isCollapsed ? 'sr-only' : 'inline'}>Transactions</span></Link></li>
        <li><Link to="recurring"><Repeat/><span className={isCollapsed ? 'sr-only' : 'inline'}>Recurring</span></Link></li>
        <li><Link to='categories'><Folders/><span className={isCollapsed ? 'sr-only' : 'inline'}>Categories</span></Link></li>
      </ul>
      <div className='border'>
        <Link><Settings/><span className={isCollapsed ? 'sr-only' : 'inline'}>Settings</span></Link><br/>
        <button onClick={handleLogout}><LogOut/><span  className={isCollapsed ? 'sr-only' : 'inline'}>Logout</span></button>
      </div>
    </nav>
  );
}

export default Nav;
