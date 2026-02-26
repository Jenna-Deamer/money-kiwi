
function TransactionTableFilters({ value, onChange }) {
    return (
        <div className="filter-container">
            <input
                placeholder="Search Memo"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default TransactionTableFilters;