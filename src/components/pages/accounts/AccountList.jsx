import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../../shared/Modal';

function AccountList({ title, accounts }) {
    const [activeAccount, setActiveAccount] = useState(null);

    const navigate = useNavigate();
    if (accounts.length === 0) return null;

    function handleChange(e, account) {
        const value = e.target.value;

        if (value === 'edit') navigate(`/accounts/form/${account.id}`);
        if (value === 'archive' || value === 'activate') setActiveAccount(account);
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
                            onChange={(e) => handleChange(e, account)}
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

            <Modal
                isOpen={!!activeAccount}
                onClose={() => setActiveAccount(null)}
                title='Confirm Status Change'
                body={
                    <>
                        {activeAccount?.status === 'active' && (
                            <div>
                                <h3>Are you sure you want to archive {activeAccount.name}?</h3>
                                <p>Your transactions will remain but the account will be hidden.</p>
                                <small>Note: Account balance must be zero to close.</small>
                            </div>
                        )}
                        {activeAccount?.status === 'archived' && (
                            <div>
                                <h3>Are you sure you want to unarchive {activeAccount.name}?</h3>
                                <p>The account will be moved back into your active lists.</p>
                            </div>
                        )}
                    </>
                }>
            </Modal>
        </section >
    );
}

export default AccountList;