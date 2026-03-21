import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import EditableCell from './EditableCell';
import MemoCategoryCell from './MemoCategoryCell';
import { useState, useEffect } from 'react';

function TransactionTable({
    transactionsData,
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
    const [data, setData] = useState(transactionsData?.transactions || []);
    const [isUnsavedData, setIsUnsavedData] = useState(false);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            initialData: transactionsData?.transactions,
            updateData: (rowIndex, columnId, value) =>
                setData((prev) =>
                    prev.map((row, index) =>
                        index === rowIndex
                            ? { ...row, [columnId]: value }
                            : row
                    )
                )
        }
    });

    useEffect(() => {
        const hasChanged = JSON.stringify(data) !== JSON.stringify(transactionsData?.transactions);
        setIsUnsavedData(hasChanged);
        console.log('saved state ' + isUnsavedData);

    }, [data, transactionsData, isUnsavedData]);

    const onSave = () => {

    };

    const onCancel = () => {
        setData(transactionsData?.transactions);
    };

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

            {isUnsavedData ? <div>
                <button onClick={onSave}>Save</button> <button onClick={onCancel}>Cancel</button>
            </div>
                : null}


        </>
    );
}

export default TransactionTable;
