import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../../shared/Modal';
import { useUpdateAccountStatus, useDeleteAccount } from '../../../context/useAccounts';

function AccountList({ title, accounts }) {
    const [activeAccount, setActiveAccount] = useState(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { mutate: updateStatus, isLoading: isUpdating } = useUpdateAccountStatus();
    const { mutate: deleteAccount, isLoading: isDeleting } = useDeleteAccount();

    const navigate = useNavigate();

    const handleClose = () => {
        setActiveAccount(null);
        setIsStatusOpen(false);
        setIsDeleteOpen(false);
    };

    function handleChange(e, account) {
        const value = e.target.value;
        setActiveAccount(account);

        if (value === 'edit') navigate(`/accounts/form/${account.id}`);
        if (value === 'archive' || value === 'activate') setIsStatusOpen(true);
        if (value === 'delete') setIsDeleteOpen(true);
    };

    const handleStatusModalConfrimation = () => {
        const newStatus = activeAccount.status === 'active' ? 'archived' : 'active';

        updateStatus({ id: activeAccount.id, status: newStatus },
            { onSuccess: handleClose }
        );
    };

    const handleDeleteModalConfirmation = () => {
        deleteAccount({ id: activeAccount.id },
            { onSuccess: handleClose }
        );
    };

    if (accounts.length === 0) return null;
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
                            <option value='delete'>Delete</option>


                        </select>
                    </div>
                </div>
            ))}

            <Modal
                isOpen={isStatusOpen}
                onClose={handleClose}
                title='Confirm Status Change'
                body={
                    activeAccount && (
                        <>
                            {activeAccount.status === 'active' && (
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
                                            onClick={handleStatusModalConfrimation}
                                            disabled={isUpdating || activeAccount.balance > 0.01}
                                        >
                                            {isUpdating ? 'Saving...' : 'Confirm Archive'}
                                        </button>
                                        <button onClick={handleClose} disabled={isUpdating}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeAccount.status === 'archived' && (
                                <div>
                                    <h3>Are you sure you want to unarchive {activeAccount.name}?</h3>
                                    <p>The account will be moved back into your active lists.</p>
                                    <button onClick={handleStatusModalConfrimation} disabled={isUpdating}>
                                        {isUpdating ? 'Saving...' : 'Confirm Unarchive'}
                                    </button>
                                    <button onClick={handleClose} disabled={isUpdating}>Cancel</button>
                                </div>
                            )}
                        </>
                    )}
            />

            <Modal
                isOpen={isDeleteOpen}
                onClose={handleClose}
                title='Confirm Deletion'
                body={
                    activeAccount && (
                        <div>
                            <h3>Are you sure you want to delete {activeAccount.name}?</h3>
                            <p>Warning: This cannot be undone. All data will be lost.</p>
                            <button onClick={handleDeleteModalConfirmation} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                            </button>
                            <button onClick={handleClose} disabled={isDeleting}>Cancel</button>
                        </div>
                    )
                }
            />
        </section >
    );
}

export default AccountList;