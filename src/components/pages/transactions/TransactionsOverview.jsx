import { Link, useNavigate } from 'react-router-dom';
import TransactionTable from './TransactionTable';
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

    const handleUpdate = (id) => navigate(`/transactions/form/${id}`);
    const openDeleteModal = (transaction) => {
        setActiveTransaction(transaction);
        setIsDeleteOpen(true);
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
            <TransactionTable data={data}
                onUpdate={handleUpdate}
                onDelete={openDeleteModal} />

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