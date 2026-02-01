import { useNavigate } from 'react-router-dom';

function AccountList({ title, accounts }) {
    const navigate = useNavigate();
    if (accounts.length === 0) return null;

    function handleChange(e, accountId) {
        const value = e.target.value;

        if (value === 'edit') navigate(`/edit-account/${accountId}`);
        if (value === 'active') console.log('Archive account: ' + accountId);
        if (value === 'activate') console.log('Unarchive account: ' + accountId);
    };

    return (
        <section>
            <h2>{title}</h2>
            {accounts.map((account) => (
                <div key={account.id}>
                    <div>
                        <h3>{account.name}</h3>
                        <div>
                            <span>{account.subCategory}</span>
                            <span>{account.registration}</span>
                        </div>
                        <small>{account.institution}</small>
                    </div>
                    <div>
                        <p>{account.balance}</p>
                        <select
                            name="account-options"
                            onChange={(e) => handleChange(e, account.id)}
                            defaultValue=""
                        >
                            <option value=''>-- Account Options --</option>
                            <option value='edit'>Edit</option>
                            {account.status === 'active' && <option value='archive'>Archive</option>}
                            {account.status === 'archived' && <option value='activate'>Unarchive</option>}


                        </select>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default AccountList;