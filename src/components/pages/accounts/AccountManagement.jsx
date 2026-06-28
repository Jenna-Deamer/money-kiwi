import { Link } from 'react-router-dom';
import AccountCard from '@/components/pages/accounts/AccountCard';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';

function AcccountMangement() {
    return (
        <>
        <h1>Your Accounts</h1>
        <LinkButton link='/accounts/form'  intent="primary" width='comfy'>Add Account</LinkButton>
            <AccountCard />
        </>
    );
}

export default AcccountMangement;
