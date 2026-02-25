

function TransactionTable({ data, onUpdate, onDelete }) {
    return (
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
                {data?.map((transaction) => (
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

    );
}

export default TransactionTable;