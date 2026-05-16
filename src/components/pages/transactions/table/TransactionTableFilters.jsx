import Select from 'react-select';
import { useAccounts } from '../../../../context/useAccounts';

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
        <div className="filter-container">
            <input
                placeholder="Search by memos..."
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <Select
                options={accountOptions}
                placeholder="Select Account..."
                isClearable
                isMulti
                // after re-render pass menu currently selected options to highlight them
                value={accountOptions.filter(opt => (account || []).includes(opt.value))}
                onChange={(selectedOptions) => {
                    // strip out label and just pass value for filter state
                    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                    onAccountChange(values);
                }}
            />
            <Select
                options={categoryOptions}
                placeholder="Select Category..."
                isClearable
                isMulti
                value={categoryOptions.filter(opt => category.includes(opt.value))}
                onChange={(selectedOptions) => {
                    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                    onCategoryChange(values);
                }}
            />
            <Select
                options={transactionTypeOptions}
                placeholder="Select Transaction Type"
                isClearable
                isMulti
                value={transactionTypeOptions.filter(opt => transactionType.includes(opt.value))}
                onChange={(selectOptions) => {
                    const values = selectOptions ? selectOptions.map(opt => opt.value) : [];
                    onTransactionTypeChange(values);
                }}>
            </Select>

            <Select
                options={accountTypeOptions}
                placeholder="Select Account Type"
                isClearable
                isMulti
                value={accountTypeOptions.filter(opt => accountType.includes(opt.value))}
                onChange={(selectOptions) => {
                    const values = selectOptions ? selectOptions.map(opt => opt.value) : [];
                    onAccountTypeChange(values);
                }}>
            </Select>
            <Select
                options={statusOptions}
                placeholder="Select Transaction Status"
                isClearable
                isMulti
                value={statusOptions.filter(opt => status.includes(opt.value))}
                onChange={(selectOptions) => {
                    const values = selectOptions ? selectOptions.map(opt => opt.value) : [];
                    onStatusChange(values);
                }}>
            </Select>


        </div>
    );
}

export default TransactionTableFilters;