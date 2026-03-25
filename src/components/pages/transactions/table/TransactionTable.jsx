import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import MemoCategoryCell from './editableCells/MemoCategoryCell';
import { useState, useEffect } from 'react';
import { transactionSchema } from '../../../../utils/validation/transactionSchema';
import { useUpdateMultipleTransactionss } from '../../../../context/useTransaction';

function TransactionTable({
    transactionsData,
    onUpdate,
    onDelete,
    // page,
    // setPage,
    // isPlaceholderData,
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
    const { mutate } = useUpdateMultipleTransactionss();

    const [newData, setNewData] = useState([]);
    const [isUnsavedData, setIsUnsavedData] = useState(false);
    const [saveErrors, setSaveErrors] = useState([]);

    const table = useReactTable({
        data: transactionsData?.transactions || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            initialData: transactionsData?.transactions,
            isUnsavedData,
            updateData: (rowIndex, columnId, value) => {
                const orginalRow = transactionsData?.transactions[rowIndex];
                const rowId = orginalRow.id;

                setNewData((prev => {
                    // find if row is arealdy being tracked
                    const existing = prev.find(row => row.id === rowId);

                    if (existing) {
                        return prev.map(row => row.id === rowId ? { ...row, [columnId]: value } : row);
                    } else {
                        return [...prev, { ...orginalRow, [columnId]: value }];
                    }
                }));
            },
        },
    });

    useEffect(() => {
        if (newData && newData.length > 0) {
            setIsUnsavedData(true);
            console.log('saved state ' + isUnsavedData);
        } else { setIsUnsavedData(false); }


    }, [newData, isUnsavedData]);

    const onSave = () => {
        const errors = [];

        newData.forEach(row => {
            const result = transactionSchema.safeParse(row);

            if (!result.success) {
                result.error.issues.forEach(issue => {
                    errors.push({
                        id: row.id,
                        memo: row.memo,
                        message: issue.message
                    });
                });
            }

            if (errors.length > 0) {
                setSaveErrors(errors);
                return;
            }

            mutate(newData, {
                onSuccess: () => {
                    setNewData([]);
                    setSaveErrors([]);
                }
            });
        });
    };

    const onCancel = () => {
        setNewData([]);
        setSaveErrors([]);
        setIsUnsavedData(false);
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
