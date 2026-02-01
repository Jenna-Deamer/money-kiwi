import { useAccounts } from '../../../context/useAccounts';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AccountCard() {
    const { data, isLoading, error } = useAccounts();
    const [serverError, setServerError] = useState('');

    if (isLoading) return <div><p>Loading...</p></div>;
    if (error || serverError) return <div><p>Error: {error?.message || serverError}</p></div>;
    console.log('React Query Data:', data);
    return (
        <>
            {
                data?.map((account) => (
                    <div key={account.id}>
                        <div>
                            <h3>{account.name}</h3>
                            <div>
                                <span>{account.category}</span><span>{account.registration}</span>
                            </div>
                            <small>{account.institution}</small>
                        </div>

                        <div>
                            <p>{account.balance}</p>
                        </div>

                    </div>
                ))
            }
        </>


    );
}

export default AccountCard;