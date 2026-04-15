import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

function Nav() {
    const navigate = useNavigate();
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
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="accounts">Accounts</Link></li>
                <li><Link to="transactions">Transactions</Link></li>
                <li><Link to='categories'>Categories</Link></li>
                <li>
                    <button onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;