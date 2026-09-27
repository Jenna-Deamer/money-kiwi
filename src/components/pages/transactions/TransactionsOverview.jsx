import { Link, useNavigate } from 'react-router-dom';
import { useAccounts } from '@/hooks/useAccounts';
import useDebounce from '@/utils/useDebounce';
import TransactionTable from '@/components/pages/transactions/table/TransactionTable';
import TransactionMobile from '@/components/pages/transactions/table/TransactionMobile';
import TransactionTableFilters from '@/components/pages/transactions/table/TransactionTableFilters';
import {
  useTransactions,
  useDeleteTransaction,
} from '@/hooks/useTransaction';
import Modal from '@/components/shared/Modal';
import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';
import Button from '@/components/shared/ui/buttons/Button';
import { useOutletContext } from 'react-router';
import DatePickerField from '@/components/shared/ui/form/DatePickerField';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';
import EmptyState from '@/components/shared/ui/EmptyState';

function TransactionOverview() {
  const { data: accounts, } = useAccounts();
  const [pickerRange, setPickerRange] = useOutletContext();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    search: '', categoryId: [], accountId: [], transactionType: [], accountType: [], status: [], startDate: pickerRange[0], endDate: pickerRange[1]
  });
  const debouncedFilters = useDebounce(filters, 500);
  const { data: transactions, isPlaceholderData, isLoading: isFetching } = useTransactions(debouncedFilters, page);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)');
    const handleChange = (e) => setIsMobile(e.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

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
  if (!accounts) return <LoadingSpinner />;
  return (
    <>
      <section>
        <div className='flex flex-col justify-center items-center mb-6 text-center md:text-left md:flex-row md:justify-between'>
          <div>
            <h1 className='mb-2'>Transactions Overview</h1>
            {hasAccounts &&
              <DatePickerField
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
              />}
          </div>
          {hasAccounts &&
            <div className='text-center flex gap-4 mt-2 md:mt-0'>
              <LinkButton to='/transactions/form'>Add Transaction</LinkButton>
              {/* <LinkButton to='/' intent='subtle'>Import</LinkButton>*/}

            </div>
          }
        </div>

        {!hasAccounts ? (
          <EmptyState>
            <p className='text-txt-muted'>You don’t have any financial accounts&nbsp;yet.<br />Create your first account to start tracking transactions.</p>
            <LinkButton to='/accounts/form' className='mt-4'>Create Account</LinkButton>
          </EmptyState>
        ) : (
          <>
            <TransactionTableFilters
              search={filters.search}
              categoryId={filters.categoryId}
              accountId={filters.accountId}
              transactionType={filters.transactionType}
              accountType={filters.accountType}
              status={filters.status}
              onSearchChange={(val) => handleFilterChange('search', val)}
              onCategoryChange={(val) => handleFilterChange('categoryId', val)}
              onAccountChange={(val) => handleFilterChange('accountId', val)}
              onTransactionTypeChange={(val) => handleFilterChange('transactionType', val)}
              onAccountTypeChange={(val) => handleFilterChange('accountType', val)}
              onStatusChange={(val) => handleFilterChange('status', val)}
            />
            {!transactions?.transactions || transactions.transactions.length === 0 ? (
              <EmptyState className='mt-4'>
                <p>
                  No transactions found. Try another filter or{' '}
                  <Link className='text-kiwi-primary underline' to='/transactions/form'>
                    create&nbsp;one
                  </Link>
                  .
                </p>
              </EmptyState>
            ) : isMobile ? (
              <TransactionMobile
                transactionsData={transactions}
                onUpdate={handleUpdate}
                onDelete={openDeleteModal}
                page={page}
                setPage={setPage}
                isPlaceholderData={isPlaceholderData}
              />
            ) : (
              <TransactionTable
                transactionsData={transactions}
                onUpdate={handleUpdate}
                onDelete={openDeleteModal}
                page={page}
                setPage={setPage}
                isPlaceholderData={isPlaceholderData}
                isLoadingTransactions={isFetching}
              />
            )}
          </>
        )}
      </section>

      <Modal
        isOpen={isDeleteOpen}
        onClose={handleClose}
        title='Delete Transaction'
        body={
          activeTransaction && (
            <div className='space-y-2'>
              <p>
                Delete <strong>{activeTransaction.memo}</strong>?
              </p>
              <p>
                This can’t be undone.
              </p>
              <p>
                If it came from a recurring template, future transactions will still be created. Manage the template in <Link to='/recurring' className='underline'>Recurring Templates</Link>.
              </p>
            </div>
          )
        }
        footer={
          <>
            <Button
              onClick={handleClose}
              disabled={isDeleting}
              intent='subtle'
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteModalConfirmation}
              disabled={isDeleting}
              intent='danger'
            >
              {isDeleting ? 'Deleting...' : 'Delete Transaction'}
            </Button>
          </>
        }
      />
    </>
  );
}

export default TransactionOverview;
