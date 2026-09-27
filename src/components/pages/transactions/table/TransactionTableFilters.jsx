import Select from 'react-select';
import { useAccounts } from '@/hooks/useAccounts';
import { useGroupChildrenCategories } from '@/hooks/useCategory';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';
import EmptyState from '@/components/shared/ui/EmptyState';

const transactionTypeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
];
const accountTypeOptions = [
  { value: 'banking', label: 'Banking' },
  { value: 'investments', label: 'Investments' },
  { value: 'credit', label: 'Credit & Loans' },
];
const statusOptions = [
  { value: 'posted', label: 'Posted' },
  { value: 'pending_match', label: 'Pending Match' },
  { value: 'upcoming', label: 'Upcoming' },
];

function TransactionTableFilters({ search, categoryId, accountId, transactionType, accountType, status, onAccountChange, onSearchChange, onCategoryChange, onTransactionTypeChange, onAccountTypeChange, onStatusChange }) {
  const { data: accounts, isLoading: isLoadingAccounts, error: accountError } = useAccounts();
  const {
    data: {
      groupedChildrenCategories: {
        INCOME: incomeCategories = [],
        EXPENSE: expenseCategories = [],
        TRANSFER: transferCategories = [],
      } = {},
    } = {},
    isLoading: isLoadingCategories,
    error: categoryError,
  } = useGroupChildrenCategories();

  const incomeOptions = incomeCategories.map(cat => ({
    value: cat.id,
    label:
      cat.name,
  }));
  const expenseOptions = expenseCategories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const transferOptions = transferCategories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const categoryOptions = [
    { label: 'Income', options: incomeOptions },
    { label: 'Expense', options: expenseOptions },
    { label: 'Transfer', options: transferOptions },
  ];

  const flatCategoryOptions = [
    incomeOptions,
    expenseOptions,
    transferOptions,
  ].flat();
  if (isLoadingAccounts || isLoadingCategories) return <LoadingSpinner />;
  if (accountError || categoryError) return <EmptyState>We couldn&apos;t load your filters. Please try again.</EmptyState>;

  const accountOptions = (accounts || []).map(acc => ({
    value: acc.id,
    label: acc.name + '-' + acc.institution
  }));
  if (accountOptions.length === 0) {
    return <div></div>;
  }
  return (
    <div className='my-6 space-y-3'>
      <div className='w-full max-w-sm'>
        <label htmlFor='transaction-search' className='sr-only'>Search transactions by memo</label>
        <input
          id='transaction-search'
          className='input-standard w-full'
          placeholder='Search by memo...'
          type='search'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4'>
        <div className='w-full'>
          <Select
            className='w-full'
            classNamePrefix='filter-select'
            options={accountOptions}
            placeholder='Account'
            aria-label='Filter by account'
            isClearable
            isMulti
            value={accountOptions.filter((opt) => accountId.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onAccountChange(values);
            }}
          />
        </div>

        <div className='w-full'>
          <Select
            className='w-full'
            classNamePrefix='filter-select'
            options={categoryOptions}
            placeholder='Category'
            aria-label='Filter by category'
            isClearable
            isMulti
            value={flatCategoryOptions.filter((opt) => categoryId.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onCategoryChange(values);
            }}
          />
        </div>

        <div className='w-full'>
          <Select
            className='w-full'
            classNamePrefix='filter-select'
            options={transactionTypeOptions}
            placeholder='Transaction type'
            aria-label='Filter by transaction type'
            isClearable
            isMulti
            value={transactionTypeOptions.filter((opt) => transactionType.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onTransactionTypeChange(values);
            }}
          />
        </div>

        <div className='w-full'>
          <Select
            className='w-full'
            classNamePrefix='filter-select'
            options={accountTypeOptions}
            placeholder='Account type'
            aria-label='Filter by account type'
            isClearable
            isMulti
            value={accountTypeOptions.filter((opt) => accountType.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onAccountTypeChange(values);
            }}
          />
        </div>

        <div className='w-full'>
          <Select
            className='w-full'
            classNamePrefix='filter-select'
            options={statusOptions}
            placeholder='Status'
            aria-label='Filter by status'
            isClearable
            isMulti
            value={statusOptions.filter((opt) => status.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onStatusChange(values);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TransactionTableFilters;
