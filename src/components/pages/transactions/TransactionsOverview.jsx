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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TransactionOverview() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [pickerRange, setPickerRange] = useState([thirtyDaysAgo, new Date()]);
    const [filters, setFilters] = useState({
        search: '', category: [], account: [], transactionType: [], accountType: [], status: [], startDate: thirtyDaysAgo, endDate: new Date()
    });
    const debouncedFilters = useDebounce(filters, 500);
    const { data: transactions, isLoading, error } = useTransactions(debouncedFilters);
    const [activeTransaction, setActiveTransaction] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { mutate: deleteTransaction, isLoading: isDeleting } =
        useDeleteTransaction();
    const navigate = useNavigate();

    function handleUpdate(id) { navigate(`/transactions/form/${id}`); };
    function openDeleteModal(transaction) {
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
                <DatePicker
                    selectsRange={true}
                    startDate={pickerRange[0]}
                    endDate={pickerRange[1]}
                    onChange={(update) => {
                        const [start, end] = update;
                        // Update UI state so the user sees their clicks
                        setPickerRange(update);
                        // Update filters when user has selected two dates
                        if (start && end) {
                            setFilters(prev => ({
                                ...prev,
                                startDate: start,
                                endDate: end
                            }));
                        }
                    }}
                    showIcon
                    closeOnScroll
                    dateFormat="dd MMM yyyy"
                />
            </div>

            <Link to="/transactions/form">Add Transaction</Link>

            <TransactionTableFilters
                search={filters.search}
                category={filters.category}
                account={filters.account}
                transactionType={filters.transactionType}
                accountType={filters.accountType}
                status={filters.status}
                onSearchChange={(val) => handleFilterChange('search', val)}
                onCategoryChange={(val) => handleFilterChange('category', val)}
                onAccountChange={(val) => handleFilterChange('account', val)}
                onTransactionTypeChange={(val) => handleFilterChange('transactionType', val)}
                onAccountTypeChange={(val) => handleFilterChange('accountType', val)}
                onStatusChange={(val) => handleFilterChange('status', val)}
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
