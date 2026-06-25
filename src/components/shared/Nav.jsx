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
        ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[10rem] opacity-100'}
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
        transition-[width] duration-200
        ${isCollapsed ? 'md:w-16' : 'md:w-56'}
      `}
    >
      <button
        type="button"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:inline mb-4 focus-primary"
        onClick={toggleNav}
      >
        {isCollapsed ? (
          <ArrowRight aria-hidden="true" className="shrink-0" />
        ) : (
          <ArrowLeft aria-hidden="true" className="shrink-0" />
        )}
      </button>

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
              <Repeat aria-hidden="true" className="shrink-0" />
              <span>Recurring</span>
            </Link>
          </li>

          <li>
            <Link
              to="categories"
              className="flex items-center gap-3 focus-primary"
            >
              <Folders aria-hidden="true" className="shrink-0" />
              <span>Categories</span>
            </Link>
          </li>

          <li className="pt-4">
            <Link
              to="settings"
              className="flex items-center gap-3 focus-primary"
            >
              <Settings aria-hidden="true" className="shrink-0" />
              <span>Settings</span>
            </Link>
          </li>

          <li>
            <button
              type="button"
              className="flex items-center gap-3 focus-primary"
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" className="shrink-0" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Nav */}
      <ul className="flex justify-center md:flex-col md:justify-start gap-6 md:gap-4">
        <li>
          <Link
            to="overview"
            aria-label={isCollapsed ? 'Overview' : undefined}
            className="flex items-center gap-2 w-full min-w-0 focus-primary"
          >
            <House aria-hidden="true" className="h-5 w-5 shrink-0" />
            <DesktopLabel isCollapsed={isCollapsed}>Overview</DesktopLabel>
          </Link>
        </li>

        <li>
          <Link
            to="accounts"
            aria-label={isCollapsed ? 'Accounts' : undefined}
            className="flex items-center gap-2 w-full min-w-0 focus-primary"
          >
            <Landmark aria-hidden="true" className="h-5 w-5 shrink-0" />
            <DesktopLabel isCollapsed={isCollapsed}>Accounts</DesktopLabel>
          </Link>
        </li>

        <li>
          <Link
            to="transactions"
            aria-label={isCollapsed ? 'Transactions' : undefined}
            className="flex items-center gap-2 w-full min-w-0 focus-primary"
          >
            <Receipt aria-hidden="true" className="h-5 w-5 shrink-0" />
            <DesktopLabel isCollapsed={isCollapsed}>Transactions</DesktopLabel>
          </Link>
        </li>

        <li>
          <Link
            to="dashboard"
            aria-label={isCollapsed ? 'Dashboard' : undefined}
            className="flex items-center gap-2 w-full min-w-0 focus-primary"
          >
            <ChartBar aria-hidden="true" className="h-5 w-5 shrink-0" />
            <DesktopLabel isCollapsed={isCollapsed}>Dashboard</DesktopLabel>
          </Link>
        </li>

        <li className="hidden md:block">
          <Link
            to="recurring"
            aria-label={isCollapsed ? 'Recurring' : undefined}
            className="flex items-center gap-2 w-full min-w-0 focus-primary"
          >
            <Repeat aria-hidden="true" className="h-5 w-5 shrink-0" />
            <DesktopLabel isCollapsed={isCollapsed}>Recurring</DesktopLabel>
          </Link>
        </li>

        <li className="hidden md:block">
          <Link
            to="categories"
            aria-label={isCollapsed ? 'Categories' : undefined}
            className="flex items-center gap-2 w-full min-w-0 focus-primary"
          >
            <Folders aria-hidden="true" className="h-5 w-5 shrink-0" />
            <DesktopLabel isCollapsed={isCollapsed}>Categories</DesktopLabel>
          </Link>
        </li>

        {/* Ellipsis: mobile-only */}
        <li className="md:hidden">
          <button
            type="button"
            aria-label={isDrawerVisble ? 'Close more menu' : 'Open more menu'}
            className="flex items-center justify-center focus-primary"
            onClick={toggleMobileDrawer}
          >
            <Ellipsis aria-hidden="true" className="shrink-0" />
            <span className="sr-only">More</span>
          </button>
        </li>
      </ul>

      <div className="flex md:flex-col gap-2">
        <Link
          to="settings"
          aria-label={isCollapsed ? 'Settings' : undefined}
          className="hidden md:flex items-center gap-2 w-full min-w-0 focus-primary"
        >
          <Settings aria-hidden="true" className="h-5 w-5 shrink-0" />
          <DesktopLabel isCollapsed={isCollapsed}>Settings</DesktopLabel>
        </Link>

        <button
          type="button"
          aria-label={isCollapsed ? 'Logout' : undefined}
          className="hidden md:flex items-center gap-2 w-full min-w-0 focus-primary"
          onClick={handleLogout}
        >
          <LogOut aria-hidden="true" className="h-5 w-5 shrink-0" />
          <DesktopLabel isCollapsed={isCollapsed}>Logout</DesktopLabel>
        </button>
      </div>
    </nav>
  );
}

export default Nav;
