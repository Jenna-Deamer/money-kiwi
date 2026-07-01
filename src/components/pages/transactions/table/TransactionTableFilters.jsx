import Select from 'react-select';
import { useAccounts } from '@/hooks/useAccounts';

const categoryOptions = [
  { value: 'food', label: 'Food' },
  { value: 'savings', label: 'Savings' }
];

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

function TransactionTableFilters({ search, category, account, transactionType, accountType, status, onAccountChange, onSearchChange, onCategoryChange, onTransactionTypeChange, onAccountTypeChange, onStatusChange }) {
  const { data: accounts, isLoading, error } = useAccounts();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  const accountOptions = (accounts || []).map(acc => ({
    value: acc.name,
    label: acc.name
  }));

  if (accountOptions.length === 0) {
    return <div></div>;
  }
  return (
    <div className="mt-6 space-y-3">
      <div className="w-full max-w-sm">
        <input
          className="input-standard w-full"
          placeholder="Search by memo..."
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <div className="w-full">
          <Select
            className="w-full"
            options={accountOptions}
            placeholder="Account"
            isClearable
            isMulti
            value={accountOptions.filter((opt) => (account || []).includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onAccountChange(values);
            }}
          />
        </div>

        <div className="w-full">
          <Select
            className="w-full"
            options={categoryOptions}
            placeholder="Category"
            isClearable
            isMulti
            value={categoryOptions.filter((opt) => category.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onCategoryChange(values);
            }}
          />
        </div>

        <div className="w-full">
          <Select
            className="w-full"
            options={transactionTypeOptions}
            placeholder="Transaction type"
            isClearable
            isMulti
            value={transactionTypeOptions.filter((opt) => transactionType.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onTransactionTypeChange(values);
            }}
          />
        </div>

        <div className="w-full">
          <Select
            className="w-full"
            options={accountTypeOptions}
            placeholder="Account type"
            isClearable
            isMulti
            value={accountTypeOptions.filter((opt) => accountType.includes(opt.value))}
            onChange={(selectedOptions) => {
              const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
              onAccountTypeChange(values);
            }}
          />
        </div>

        <div className="w-full">
          <Select
            className="w-full"
            options={statusOptions}
            placeholder="Status"
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
