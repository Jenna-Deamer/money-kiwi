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
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';
import Button from '@/components/shared/ui/buttons/Button';
import { useOutletContext } from 'react-router';
import DatePickerField from '@/components/shared/ui/form/DatePickerField';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';

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
  const { mutate: deleteTransaction, isLoading: isDeleting } =
    useDeleteTransaction();
  const navigate = useNavigate();
  const isMobile = window.matchMedia('(max-width: 600px');

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
        <div className='flex flex-col justify-center items-center mb-4 text-center md:text-left md:flex-row md:justify-between'>
          <div>
            <h1 className='mb-0.5'>Transactions Overview</h1>
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
          <div className='card text-center max-w-md m-auto md:m-0'>
            <p className='text-txt-muted'>You don’t have any financial accounts&nbsp;yet.<br />Create your first account to start tracking transactions.</p>
            <LinkButton to='/accounts/form' className='mt-2'>Create Account</LinkButton>
          </div>
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
              <div className='card max-w-md text-center mx-auto mt-4'>
                <p>
                  No transactions found. Try another filter or{' '}
                  <Link className='text-kiwi-primary underline' to='/transactions/form'>
                    create&nbsp;one
                  </Link>
                  .
                </p>
              </div>
            ) : isMobile.matches ? (
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
        title='Delete transaction'
        body={
          activeTransaction && (
            <div className='space-y-2'>
              <p>
                Delete transaction <strong>{activeTransaction.memo}</strong>?
              </p>
              <p>
                This action can’t be undone.
              </p>
              <p>
                If this transaction was created from a recurring template, deleting it here won’t stop future transactions. Delete the template in <Link to='/recurring' className='underline'>Recurring Templates</Link> instead.
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
