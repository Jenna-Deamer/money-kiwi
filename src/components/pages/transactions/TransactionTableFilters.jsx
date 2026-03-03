import Select from 'react-select';
import { useAccounts } from '../../../context/useAccounts';

const options = [
    { value: 'food', label: 'food' },
    { value: 'savings', label: 'savings' }
];

function TransactionTableFilters({ search, category, account, onAccountChange, onSearchChange, onCategoryChange }) {
    const { data: accounts, isLoading, error } = useAccounts();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    const accountOptions = (accounts || []).map(acc => ({
        value: acc.name,
        label: acc.name
    }));

    if (accountOptions.length === 0) {
        return <div>You don't have any accounts created yet!</div>;
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
                options={options}
                placeholder="Select Category..."
                isClearable
                isMulti
                value={options.filter(opt => category.includes(opt.value))}
                onChange={(selectedOptions) => {
                    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                    onCategoryChange(values);
                }}
            />


        </div>
    );
}

export default TransactionTableFilters;