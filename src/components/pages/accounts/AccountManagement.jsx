import { Link } from 'react-router-dom';
import AccountCard from './AccountCard';

function AcccountMangement() {
    return (
        <>
            <h1>Your Accounts</h1>
            <Link to='/accounts/form'>Add Account</Link>
            <AccountCard />
        </>
    );
}

export default AcccountMangement;