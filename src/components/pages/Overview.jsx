import { useAuth } from '@/context/AuthContext';

function Overview() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Welcome {user?.name || 'User'}</h1>
        </div>
    );
}

export default Overview;
