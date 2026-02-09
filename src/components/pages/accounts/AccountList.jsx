import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../../shared/Modal';
import { useUpdateAccountStatus } from '../../../context/useAccounts';

function AccountList({ title, accounts }) {
    const [activeAccount, setActiveAccount] = useState(null);
    const { mutate: updateStatus, isLoading: isUpdating } = useUpdateAccountStatus();

    const navigate = useNavigate();
    if (accounts.length === 0) return null;

    function handleChange(e, account) {
        const value = e.target.value;

        if (value === 'edit') navigate(`/accounts/form/${account.id}`);
        if (value === 'archive' || value === 'activate') setActiveAccount(account);
    };

    const handleModalConfrimation = () => {
        const newStatus = activeAccount.status === 'active' ? 'archived' : 'active';

        updateStatus({ id: activeAccount.id, status: newStatus },
            { onSuccess: () => setActiveAccount(null) }
        );
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
                                <h3>Archive {activeAccount.name}?</h3>
                                <p>Your transactions will remain but the account will be hidden.</p>

                                {activeAccount.balance > 0.01 ? (
                                    <div>
                                        <p><strong>Cannot Archive:</strong> Balance must be zero.</p>
                                        <p>Current balance: ${activeAccount.balance.toFixed(2)}</p>
                                        <button onClick={() => navigate('/transfers/new')}>
                                            Go to Transfers
                                        </button>
                                    </div>
                                ) : (
                                    <p>Ready to archive.</p>
                                )}

                                <div>
                                    <button
                                        onClick={handleModalConfrimation}
                                        disabled={isUpdating || activeAccount.balance > 0.01}
                                    >
                                        {isUpdating ? 'Saving...' : 'Confirm Archive'}
                                    </button>
                                    <button onClick={() => setActiveAccount(null)} disabled={isUpdating}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeAccount?.status === 'archived' && (
                            <div>
                                <h3>Are you sure you want to unarchive {activeAccount.name}?</h3>
                                <p>The account will be moved back into your active lists.</p>
                                <button onClick={handleModalConfrimation} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Confirm Unarchive'}</button><button onClick={() => setActiveAccount(null)} disabled={isUpdating}>Cancel</button>
                            </div>
                        )}
                    </>
                }>
            </Modal>
        </section >
    );
}

export default AccountList;