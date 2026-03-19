import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import EditableCell from './EditableCell';
import MemoCategoryCell from './MemoCategoryCell';

function TransactionTable({
    data,
    onUpdate,
    onDelete,
    page,
    setPage,
    isPlaceholderData,
}) {
    const columns = [
        {
            header: 'Memo / Category',
            accessorFn: (row) => `${row.memo} ${row.category}`,
            cell: MemoCategoryCell
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: (info) => <p>${info.getValue().toFixed(2)}</p>,
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: (info) =>
                new Date(info.getValue()).toLocaleDateString('en-CA', {
                    timeZone: 'UTC',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }),
        },
        {
            header: 'Type/Status',
            accessorFn: (row) => `${row.type} ${row.status}`,
            cell: ({ row }) => (
                <span>
                    <div>
                        {row.original.type}
                        <br />
                        <small>{row.original.status}</small>
                    </div>
                </span>
            ),
        },
        {
            accessorKey: 'account.name',
            header: 'Account',
            cell: (info) => info.getValue() || 'Unknown Account',
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div>
                    <button onClick={() => onUpdate(row.original.id)}>Update</button>
                    <button onClick={() => onDelete(row.original)}>Delete</button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.transactions || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    console.log(table.getHeaderGroups());
    return (
        <>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 
            <div>
                <p>Showing: {data?.transactions.length}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Memo / Category</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Type/Status</th>
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data?.transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.memo}<br /><small>{transaction.category}</small></td>
                                <td>{transaction.amount.toFixed(2)}</td>
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
                        if (!isPlaceholderData && data.totalPages) {
                            setPage((prev) => prev + 1);
                        }
                    }}
                    disabled={isPlaceholderData || page >= data?.totalPages - 1}
                >
                    Next Page
                </button>
            </div> */}
        </>
    );
}

export default TransactionTable;
