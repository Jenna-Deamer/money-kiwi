import AccountList from './AccountList';
import { useCategorizedAccounts } from '../../../context/useAccounts';
import { useNavigate } from 'react-router-dom';

function AccountCard() {
    const { data, isLoading, error } = useCategorizedAccounts();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;
    if (data.isEmpty) return <div>You don't have any accounts create one to get started!</div>;

    return (
        <>
            <AccountList title='Cash & Banking' accounts={data.banking} />
            <AccountList title='Investments' accounts={data.investments} />
            <AccountList title='Debt' accounts={data.debt} />
            <AccountList title='Archived' accounts={data.archived} />
        </>
    );
}

export default AccountCard;
