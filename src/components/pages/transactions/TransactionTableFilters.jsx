
function TransactionTableFilters({ search, category, onSearchChange, onCategoryChange }) {
    return (
        <div className="filter-container">
            <input
                placeholder="Search by memos..."
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <select onChange={(e) => onCategoryChange(e.target.value)} value={category}>
                <option value=''>Filter by Category</option>
                <option value='food'>Food</option>
                <option value='savings'>Savings</option>
            </select>
        </div>
    );
}

export default TransactionTableFilters;