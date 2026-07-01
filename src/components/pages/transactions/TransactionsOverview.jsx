import { Link, useNavigate } from 'react-router-dom';
import { useAccounts } from '@/hooks/useAccounts';
import useDebounce from '@/utils/useDebounce';
import TransactionTable from '@/components/pages/transactions/table/TransactionTable';
import TransactionTableFilters from '@/components/pages/transactions/table/TransactionTableFilters';
import {
  useTransactions,
  useDeleteTransaction,
} from '@/hooks/useTransaction';
import Modal from '@/components/shared/Modal';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';

function TransactionOverview() {
  const { data: accounts, } = useAccounts();
  const thirtyDaysAgo = new Date();
  const [page, setPage] = useState(0);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [pickerRange, setPickerRange] = useState([thirtyDaysAgo, new Date()]);
  const [filters, setFilters] = useState({
    search: '', category: [], account: [], transactionType: [], accountType: [], status: [], startDate: thirtyDaysAgo, endDate: new Date()
  });
  const debouncedFilters = useDebounce(filters, 500);
  const { data: transactions, isLoading, error, isPlaceholderData } = useTransactions(debouncedFilters, page);
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

  const handleDeleteModalConfirmation = () => deleteTransaction({ id: activeTransaction.id }, { onSuccess: handleClose });
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const hasAccounts = accounts && accounts.length > 0;
  if (!accounts) return <div>Loading accounts...</div>;

  return (
    <>
      <section className='h-full'>
        <div className='flex justify-between mb-4'>
          <div>
            <h1 className='mb-0.5'>Transactions Overview</h1>
            {hasAccounts && <DatePicker
              className='input-standard'
              selectsRange={true}
              startDate={pickerRange[0]}
              endDate={pickerRange[1]}
              onChange={(update) => {
                const [start, end] = update;
                setPickerRange(update);
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
            />}
          </div>
          {hasAccounts &&
            <div className='text-center'>
              <LinkButton to="/transactions/form">Add Transaction</LinkButton>
            </div>
          }
        </div>

        {!hasAccounts ? (
          <div className='card text-center max-w-md'>
            <p>You don’t have any financial accounts yet. Create an account to add your first transaction.</p>
            <LinkButton to="/account/form" className='mt-2'>Create Account</LinkButton>
          </div>
        ) : (
          <>

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
            {!transactions?.transactions || transactions.transactions.length === 0 ? (
              <div className='card max-w-md text-center mx-auto mt-4'>
                <p>No transactions found. Try another filter or <Link className="text-kiwi-primary underline" to="/transactions/form">create&nbsp;one</Link>.</p>
              </div>
            ) : (
              <div>
                <TransactionTable
                  transactionsData={transactions}
                  onUpdate={handleUpdate}
                  onDelete={openDeleteModal}
                  page={page}
                  setPage={setPage}
                  isPlaceholderData={isPlaceholderData}
                />
              </div>
            )}
          </>
        )}
      </section>

      <Modal
        isOpen={isDeleteOpen}
        onClose={handleClose}
        body={
          activeTransaction && (
            <div>
              <h3>Are you sure you want to delete {activeTransaction.memo}?</h3>
              <p>Transaction amount: <strong>${activeTransaction.amount.toFixed(2)}</strong></p>
              <p>Account: <strong>{activeTransaction.account?.name || 'Unknown Account'}</strong></p>
              <p>Warning: This cannot be undone. The transaction will be permanently removed.</p>
              <button onClick={handleDeleteModalConfirmation} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
              <button onClick={handleClose} disabled={isDeleting}>Cancel</button>
            </div>
          )
        }
      />
    </>
  );
}

export default TransactionOverview;
