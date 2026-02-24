import { Link, useNavigate } from 'react-router-dom';
import { useTransactions, useDeleteTransaction } from '../../../context/useTransaction';
import Modal from '../../shared/Modal';
import { useState } from 'react';

function TransactionOverview() {
    const { data, isLoading, error } = useTransactions();
    const [activeTransaction, setActiveTransaction] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { mutate: deleteTransaction, isLoading: isDeleting } = useDeleteTransaction();
    const navigate = useNavigate();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;
    if (data.isEmpty) return <div>No transacations. Create one or try another filter.</div>;

    function handleUpdate(id) {
        navigate(`/transactions/form/${id}`);
    };

    function handleClose() {
        setIsDeleteOpen(false);
    };

    function handleDeleteModalConfirmation() {
        deleteTransaction({ id: activeTransaction.id },
            { onSuccess: handleClose }
        );
    };

    return (
        <>
            <h1>Transactions Overview</h1>
            <Link to='/transactions/form'>Add Transaction</Link>
            <table>
                <thead>
                    <tr>
                        <th>Memo</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Type/Status</th>
                        <th>Account</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.memo}</td>
                            <td>{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.category}</td>
                            <td>
                                {new Date(transaction.date).toLocaleDateString('en-CA', {
                                    timeZone: 'UTC',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </td>
                            <td>{transaction.type} {transaction.status}</td>
                            <td>{transaction.account?.name || 'Unkown Account'}</td>
                            <td><button onClick={() => handleUpdate(transaction.id)}>Update</button> <button onClick={() => {
                                setActiveTransaction(transaction);
                                setIsDeleteOpen(true);
                            }}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <Modal
                isOpen={isDeleteOpen}
                onClose={handleClose}
                body={
                    activeTransaction && (
                        <div>
                            <h3>
                                Are you sure you want to delete {activeTransaction.memo}?
                            </h3>

                            <p>
                                Transaction amount: <strong>
                                    ${activeTransaction.amount.toFixed(2)}
                                </strong>
                            </p>

                            <p>
                                Account: <strong>
                                    {activeTransaction.account?.name || 'Unknown Account'}
                                </strong>
                            </p>

                            <p>
                                Warning: This cannot be undone. The transaction will be permanently removed.
                            </p>

                            <button
                                onClick={handleDeleteModalConfirmation}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                            </button>

                            <button
                                onClick={handleClose}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                        </div>
                    )
                }
            />
        </>
    );
}

export default TransactionOverview;