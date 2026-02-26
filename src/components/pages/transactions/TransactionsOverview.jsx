import { Link, useNavigate } from 'react-router-dom';
import useDebounce from '../../../utils/useDebounce';
import TransactionTable from './TransactionTable';
import TransactionTableFilters from './TransactionTableFilters';
import {
    useTransactions,
    useDeleteTransaction,
} from '../../../context/useTransaction';
import Modal from '../../shared/Modal';
import { useState } from 'react';

function TransactionOverview() {
    const [filters, setFilters] = useState({ search: '' });
    const debouncedFilters = useDebounce(filters, 500);
    const { data: transactions, isLoading, error } = useTransactions(debouncedFilters);
    const [activeTransaction, setActiveTransaction] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { mutate: deleteTransaction, isLoading: isDeleting } =
        useDeleteTransaction();
    const navigate = useNavigate();

    const handleUpdate = (id) => navigate(`/transactions/form/${id}`);
    const openDeleteModal = (transaction) => {
        setActiveTransaction(transaction);
        setIsDeleteOpen(true);
    };
    function handleClose() {
        setIsDeleteOpen(false);
    };

    function handleDeleteModalConfirmation() {
        deleteTransaction({ id: activeTransaction.id }, { onSuccess: handleClose });
    };

    const handleFilterChange = (key, value) => {
        console.log(key + ' ' + value);
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <div>
                <h1>Transactions Overview</h1>
                <h2>Showing current date - current date</h2>
            </div>

            <Link to="/transactions/form">Add Transaction</Link>

            <TransactionTableFilters
                value={filters.search}
                onChange={(val) => handleFilterChange('search', val)}
            />

            <div>
                {isLoading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error loading transactions.</div>
                ) : (!transactions || transactions.length === 0) ? (
                    <div>No transactions found. Create one or try another filter.</div>
                ) : (
                    <TransactionTable
                        data={transactions}
                        onUpdate={handleUpdate}
                        onDelete={openDeleteModal}
                    />
                )}
            </div>

            <Modal
                isOpen={isDeleteOpen}
                onClose={handleClose}
                body={
                    activeTransaction && (
                        <div>
                            <h3>Are you sure you want to delete {activeTransaction.memo}?</h3>

                            <p>
                                Transaction amount:{' '}
                                <strong>${activeTransaction.amount.toFixed(2)}</strong>
                            </p>

                            <p>
                                Account:{' '}
                                <strong>
                                    {activeTransaction.account?.name || 'Unknown Account'}
                                </strong>
                            </p>

                            <p>
                                Warning: This cannot be undone. The transaction will be
                                permanently removed.
                            </p>

                            <button
                                onClick={handleDeleteModalConfirmation}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                            </button>

                            <button onClick={handleClose} disabled={isDeleting}>
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
