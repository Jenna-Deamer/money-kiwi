import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  const [isDrawerVisble, setIsDrawerVisible] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  const desktopNavItemClass = `flex items-center w-full min-w-0 focus-primary${!isCollapsed ? ' gap-2' : ''}`;

  const handleLogout = () => {
    logout();
    toast.success('Farewell', {
      description: 'You have been signed out successfully.'
    });
    navigate('/login');
  };

  const toggleNav = () => {
    setIsCollapsed(prevIsCollapsed => !prevIsCollapsed);
  };

  const toggleMobileDrawer = () => {
    setIsDrawerVisible(prevIsDrawerVisible => !prevIsDrawerVisible);
  };

  if (!isAuthenticated) return null;

  return (
    <nav
      className={`
        order-2 md:order-1 sidebar overflow-x-hidden
        md:h-screen sticky  md:top-0
        bg-kiwi-dark
        text-white
        transition-[width] duration-200 px-4
         bottom-0 left-0 right-0 z-50
        ${isCollapsed ? 'md:w-fit' : 'md:w-fit'}
      `}
    >
      {/* Mobile secondary Nav */}
      <div
        className={`
          md:hidden overflow-hidden
          transition-[max-height] duration-200
          ${isDrawerVisble ? 'max-h-60' : 'max-h-0'}
        `}
      >
        <ul className="flex flex-col gap-4 px-4 pb-6">
          <li>
            <Link
              to="recurring"
              className="flex items-center gap-3 focus-primary"
            >
              <Repeat aria-hidden="true" className="icon-lg" />
              <span>Recurring</span>
            </Link>
          </li>

          <li>
            <Link
              to="categories"
              className="flex items-center gap-3 focus-primary"
            >
              <Folders aria-hidden="true" className="icon-lg" />
              <span>Categories</span>
            </Link>
          </li>

          <li className="pt-4">
            <Link
              to="settings"
              className="flex items-center gap-3 focus-primary"
            >
              <Settings aria-hidden="true" className="icon-lg" />
              <span>Settings</span>
            </Link>
          </li>

          <li>
            <button
              type="button"
              className="flex items-center gap-3 focus-primary"
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" className="icon-lg" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Nav */}
      <ul className="flex justify-center md:flex-col md:justify-start md:h-full">
        <li className={`${isCollapsed ? 'justify-center' : 'justify-end'} flex`}>
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:inline mb-4 focus-primary cursor-pointer"
            onClick={toggleNav}
          >
            {isCollapsed ? (
              <ArrowRight aria-hidden="true" className="icon-lg" />
            ) : (
              <ArrowLeft aria-hidden="true" className="icon-lg" />
            )}
          </button>
        </li>

        <div className="flex md:flex-col md:gap-6 gap-8 md:pt-8">
          <li>
            <Link
              to="overview"
              aria-label={isCollapsed ? 'Overview' : undefined}
              className={desktopNavItemClass}
            >
              <House aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Overview</DesktopLabel>
            </Link>
          </li>

          <li>
            <Link
              to="accounts"
              aria-label={isCollapsed ? 'Accounts' : undefined}
              className={desktopNavItemClass}
            >
              <Landmark aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Accounts</DesktopLabel>
            </Link>
          </li>

          <li>
            <Link
              to="transactions"
              aria-label={isCollapsed ? 'Transactions' : undefined}
              className={desktopNavItemClass}
            >
              <Receipt aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Transactions</DesktopLabel>
            </Link>
          </li>

          <li>
            <Link
              to="dashboard"
              aria-label={isCollapsed ? 'Dashboard' : undefined}
              className={desktopNavItemClass}
            >
              <ChartBar aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Dashboard</DesktopLabel>
            </Link>
          </li>

          <li className="hidden md:block">
            <Link
              to="recurring"
              aria-label={isCollapsed ? 'Recurring' : undefined}
              className={desktopNavItemClass}
            >
              <Repeat aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Recurring</DesktopLabel>
            </Link>
          </li>

          <li className="hidden md:block">
            <Link
              to="categories"
              aria-label={isCollapsed ? 'Categories' : undefined}
              className={desktopNavItemClass}
            >
              <Folders aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Categories</DesktopLabel>
            </Link>
          </li>

          <li className="md:hidden">
            <button
              type="button"
              aria-label={isDrawerVisble ? 'Close more menu' : 'Open more menu'}
              className="flex items-center justify-center focus-primary"
              onClick={toggleMobileDrawer}
            >
              <Ellipsis aria-hidden="true" className="icon-lg" />
              <span className="sr-only">More</span>
            </button>
          </li>
        </div>

        <div className="flex md:flex-col md:mt-auto md:pb-8 md:gap-6">
          <li>
            <Link
              to="settings"
              aria-label={isCollapsed ? 'Settings' : undefined}
              className={`hidden md:flex items-center w-full min-w-0 focus-primary${!isCollapsed ? ' gap-2' : ''}`}
            >
              <Settings aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Settings</DesktopLabel>
            </Link>
          </li>

          <li>
            <button
              type="button"
              aria-label={isCollapsed ? 'Logout' : undefined}
              className={`hidden cursor-pointer md:flex items-center w-full min-w-0 focus-primary${!isCollapsed ? ' gap-2' : ''}`}
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" className="icon-lg" />
              <DesktopLabel isCollapsed={isCollapsed}>Logout</DesktopLabel>
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Nav;
