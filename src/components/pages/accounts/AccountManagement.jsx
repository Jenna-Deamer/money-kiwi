import { Link } from 'react-router-dom';

function AcccountMangement() {
    return (
        <>
            <h1>Your Accounts</h1>
            <Link to='add-account'>Add Account</Link>
        </>
    )
}

export default AcccountMangement;