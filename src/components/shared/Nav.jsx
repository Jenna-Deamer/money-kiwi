import { Link, useNavigate } from 'react-router-dom';
import { useState} from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { House,ChartBar, Receipt, Repeat,Landmark,Folders, Upload, Settings,LogOut, ArrowRight, ArrowLeft, Ellipsis} from 'lucide-react';

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
    setIsCollapsed(prevIsCollapsed => !prevIsCollapsed);

    if (isCollapsed === true) {
      //
    } else {
      //
    }
  };


  if (!isAuthenticated) return null;
  return (
    <nav
      className={`order-2 md:order-1 sidebar transition-[width] duration-200
        ${isCollapsed ? 'md:w-16' : 'md:w-56'}`}
    >
      <button
        className="mb-4 hidden md:inline"
        onClick={toggleNav}
      >
        {isCollapsed ? <ArrowRight /> : <ArrowLeft />}
      </button>

      <ul className="flex justify-center md:flex-col md:justify-start gap-6 md:gap-4">
        <li>
          <Link to="/" className="flex items-center gap-2">
            <House />
            <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>

              Overview
            </span>
          </Link>
        </li>

        <li>
          <Link to="accounts" className="flex items-center gap-2">
            <Landmark />
            <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>
              Accounts
            </span>
          </Link>
        </li>

        <li>
          <Link to="transactions" className="flex items-center gap-2">
            <Receipt />
            <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>
              Transactions
            </span>
          </Link>
        </li>

        <li>
          <Link to="dashboard" className="flex items-center gap-2">
            <ChartBar />
            <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>

              Dashboard
            </span>
          </Link>
        </li>

        {/* Hide on mobile, show at md+ */}
        <li className="hidden md:block">
          <Link to="recurring" className="flex items-center gap-2">
            <Repeat />
            <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>
              Recurring
            </span>
          </Link>
        </li>

        <li className="hidden md:block">
          <Link to="categories" className="flex items-center gap-2">
            <Folders />
            <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>
              Categories
            </span>
          </Link>
        </li>

        {/* Ellipsis: mobile-only */}
        <li className="md:hidden">
          <button className="flex items-center justify-center">
            <Ellipsis />
          </button>
        </li>
      </ul>

      <div className="flex md:flex-col gap-2">
        <Link className="hidden md:flex items-center gap-2">
          <Settings />
          <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>
            Settings
          </span>
        </Link>

        <button
          className="hidden md:flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut />
          <span className={isCollapsed ? 'sr-only' : 'sr-only md:not-sr-only'}>
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Nav;
