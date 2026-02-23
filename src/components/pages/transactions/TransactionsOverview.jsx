import { Link, useNavigate } from 'react-router-dom';
import { useTransactions } from '../../../context/useTransaction';

function TransactionOverview() {
    const { data, isLoading, error } = useTransactions();
    const navigate = useNavigate();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;
    if (data.isEmpty) return <div>No transacations. Create one or try another filter.</div>;

    function handleUpdate(id) {
        navigate(`/transactions/form/${id}`);
    };

    return (
        <>
            <h1>Transactions Overview</h1>
            <Link to='/transactions/form'>Add Transaction</Link>
            <table>
                <thead>
                    <tr>
                        <th>Memo</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
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
                            <td>{transaction.account?.name || 'Unkown Account'}</td>
                            <td><button onClick={() => handleUpdate(transaction.id)}>Update</button> <button>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default TransactionOverview;