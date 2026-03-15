

function TransactionTable({ data, onUpdate, onDelete, page, setPage, isPlaceholderData }) {
    return (
        <>
            <p>Showing: {data?.transactions.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>Memo</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Type/Status</th>
                        <th>Account</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.memo}</td>
                            <td>{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.category}</td>
                            <td>
                                {new Date(transaction.date).toLocaleDateString('en-CA', {
                                    timeZone: 'UTC',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </td>
                            <td>{transaction.type} {transaction.status}</td>
                            <td>{transaction.account?.name || 'Unkown Account'}</td>
                            <td>
                                <button onClick={() => onUpdate(transaction.id)}>Update</button>
                                <button onClick={() => onDelete(transaction)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <span>Current Page: {page + 1}</span>
            <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
            >
                Previous Page
            </button>
            <button
                onClick={() => {
                    if (!isPlaceholderData && data.hasMore) {
                        setPage((prev) => prev + 1);
                    }
                }}
                disabled={isPlaceholderData || !data?.hasMore}
            >
                Next Page
            </button>
        </>

    );
}

export default TransactionTable;