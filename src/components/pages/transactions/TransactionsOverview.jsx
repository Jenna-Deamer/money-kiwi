import { Link } from 'react-router-dom';

function TransactionOverview() {
    return (
        <>
            <h1>Transactions Overview</h1>
            <Link to='/transactions/form'>Add Transaction</Link>
        </>
    );
}

export default TransactionOverview;