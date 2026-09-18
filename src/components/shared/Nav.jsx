import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  House,
  ChartBar,
  Receipt,
  Repeat,
  Landmark,
  Folders,
  Settings,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Ellipsis
} from 'lucide-react';

function DesktopLabel({ children, isCollapsed }) {
  return (
    <span
      aria-hidden={isCollapsed}
      className={`
        hidden md:block overflow-hidden whitespace-nowrap
        transition-[opacity,max-width] duration-200
        ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'}
      `}
    >
      {children}
    </span>
  );
}

function Nav() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navRef = useRef(null);

  const { isAuthenticated, isLoading, logout } = useAuth();

  const desktopNavItemClass = `max-md:p-2.5 md:p-2 flex items-center w-full min-w-0 rounded-md focus-primary transition-colors ${isCollapsed ? 'md:justify-center' : 'md:justify-start md:gap-2'
    }`;

  const getDesktopNavClass = ({ isActive }) =>
    `${desktopNavItemClass} ${isActive
      ? 'bg-kiwi-soft text-kiwi-dark font-semibold'
      : 'text-white hover:bg-white/10'
    }`;

  const getMobileDrawerNavClass = ({ isActive }) =>
    `max-md:p-2.5 flex items-center gap-3 rounded-md focus-primary transition-colors ${isActive
      ? 'bg-kiwi-soft text-kiwi-dark font-semibold'
      : 'text-white hover:bg-white/10'
    }`;

  const handleLogout = () => {
    logout();
    toast.success('Goodbye!', {
      description: 'You have been signed out successfully.'
    });
    navigate('/login');
  };

  useEffect(() => {
    const handleOutsideAccountMenuClick = (e) => {
      if (!navRef.current?.contains(e.target)) toggleMobileDrawer();
    };

    if (!isDrawerVisible) return;

    window.addEventListener('mousedown', handleOutsideAccountMenuClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideAccountMenuClick);
    };
  }, [isDrawerVisible]);

  const toggleNav = () => {
    setIsCollapsed(prevIsCollapsed => !prevIsCollapsed);
  };

  const toggleMobileDrawer = () => {
    setIsDrawerVisible(prevIsDrawerVisible => !prevIsDrawerVisible);
  };

  const closeMobileDrawer = () => setIsDrawerVisible(false);

  if (!isAuthenticated && !isLoading) return null;

  return (
    <nav
      ref={navRef}
      className={`
        order-2 md:order-1 sidebar overflow-x-hidden
        pt-3 md:pt-3
        md:h-screen sticky md:top-0
        bg-nav-bg
        text-white
        transition-[width,padding] duration-200
        bottom-0 left-0 right-0 z-50
        ${isCollapsed ? 'md:w-14 md:px-2' : 'md:w-48 md:px-4'}
      `}
    >
      {/* Mobile secondary Nav */}
      <div
        className={`
          md:hidden overflow-hidden
          transition-[max-height] duration-200
          ${isDrawerVisible ? 'max-h-60' : 'max-h-0'}
        `}
      >
        <ul className='flex flex-col gap-2 px-4'>
          <li>
            <NavLink
              to='recurring'
              className={getMobileDrawerNavClass}
              onClick={closeMobileDrawer}
            >
              <Repeat aria-hidden='true' className='icon-lg' />
              <span>Recurring</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              onClick={closeMobileDrawer}
              to='categories'
              className={getMobileDrawerNavClass}
            >
              <Folders aria-hidden='true' className='icon-lg' />
              <span>Categories</span>
            </NavLink>
          </li>

          {/* <li className='pt-4'>
            <NavLink
              onClick={closeMobileDrawer}
              to='settings'
              className={getMobileDrawerNavClass}
            >
              <Settings aria-hidden='true' className='icon-lg' />
              <span>Settings</span>
            </NavLink>
          </li>*/}

          <li>
            <button
              type='button'
              className='max-md:p-2.5 flex items-center gap-3 focus-primary'
              onClick={handleLogout}
            >
              <LogOut aria-hidden='true' className='icon-lg' />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Nav */}
      <ul className='flex justify-center md:flex-col md:justify-start md:h-full'>
        <li className={`${isCollapsed ? 'justify-center' : 'justify-end'} flex`}>
          <button
            type='button'
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className='hidden md:inline focus-primary cursor-pointer'
            onClick={toggleNav}
          >
            {isCollapsed ? (
              <ArrowRight aria-hidden='true' className='icon-lg' />
            ) : (
              <ArrowLeft aria-hidden='true' className='icon-lg' />
            )}
          </button>
        </li>

        <div className='flex md:flex-col md:gap-4 gap-4 md:pt-8'>
          <li>
            <NavLink
              end
              onClick={closeMobileDrawer}
              to='overview'
              aria-label={isCollapsed ? 'Overview' : undefined}
              className={getDesktopNavClass}
            >
              <House aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Overview
              </DesktopLabel>
            </NavLink>
          </li>

          <li>
            <NavLink
              onClick={closeMobileDrawer}
              to='accounts'
              aria-label={isCollapsed ? 'Accounts' : undefined}
              className={getDesktopNavClass}
            >
              <Landmark aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Accounts
              </DesktopLabel>
            </NavLink>
          </li>

          <li>
            <NavLink
              onClick={closeMobileDrawer}
              to='transactions'
              aria-label={isCollapsed ? 'Transactions' : undefined}
              className={getDesktopNavClass}
            >
              <Receipt aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Transactions
              </DesktopLabel>
            </NavLink>
          </li>

          <li>
            <NavLink
              onClick={closeMobileDrawer}
              to='dashboard'
              aria-label={isCollapsed ? 'Dashboard' : undefined}
              className={getDesktopNavClass}
            >
              <ChartBar aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Dashboard
              </DesktopLabel>
            </NavLink>
          </li>

          <li className='hidden md:block'>
            <NavLink
              onClick={closeMobileDrawer}
              to='recurring'
              aria-label={isCollapsed ? 'Recurring' : undefined}
              className={getDesktopNavClass}
            >
              <Repeat aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Recurring
              </DesktopLabel>
            </NavLink>
          </li>

          <li className='hidden md:block'>
            <NavLink
              onClick={closeMobileDrawer}
              to='categories'
              aria-label={isCollapsed ? 'Categories' : undefined}
              className={getDesktopNavClass}
            >
              <Folders aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Categories
              </DesktopLabel>
            </NavLink>
          </li>

          <li className='md:hidden'>
            <button
              type='button'
              aria-label={isDrawerVisible ? 'Close more menu' : 'Open more menu'}
              className='max-md:p-2.5 flex items-center justify-center focus-primary'
              onClick={toggleMobileDrawer}
            >
              <Ellipsis aria-hidden='true' className='icon-lg' />
              <span className='sr-only'>More</span>
            </button>
          </li>
        </div>

        <div className='flex md:flex-col md:mt-auto md:pb-8 md:gap-6'>
          {/* <li>
            <NavLink
              onClick={closeMobileDrawer}
              to='settings'
              aria-label={isCollapsed ? 'Settings' : undefined}
              className={getDesktopNavClass}
            >
              <Settings aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Settings
              </DesktopLabel>
            </NavLink>
          </li>*/}

          <li>
            <button
              type='button'
              aria-label={isCollapsed ? 'Logout' : undefined}
              className={`hidden cursor-pointer md:flex items-center w-full min-w-0 focus-primary ${isCollapsed ? 'md:justify-center' : 'md:justify-start md:gap-2'
                }`}
              onClick={handleLogout}
            >
              <LogOut aria-hidden='true' className='icon-lg' />
              <DesktopLabel isCollapsed={isCollapsed}>
                Logout
              </DesktopLabel>
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Nav;
