import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import MemoCategoryCell from '@/components/pages/transactions/table/editableCells/MemoCategoryCell';
import AmountCell from '@/components/pages/transactions/table/editableCells/AmountCell';
import { useState, useEffect } from 'react';
import DateCell from '@/components/pages/transactions/table/editableCells/DateCell';
import { transactionSchema } from '@/utils/validation/transactionSchema';
import { useUpdateMultipleTransactions } from '@/hooks/useTransaction';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/shared/ui/buttons/Button';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';
import PaginationControls from './PaginationControls';

function TransactionTable({
  transactionsData,
  onUpdate,
  onDelete,
  page,
  setPage,
  isPlaceholderData,
  isLoadingTransactions
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
      cell: AmountCell
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: DateCell
    },
    {
      header: 'Type/Status',
      accessorFn: (row) => `${row.type} ${row.status}`,
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <p>{row.original.type}</p>
          <small className='text-xs font-light text-txt-muted'>{row.original.status}</small>
        </div>
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
        <div className='flex flex-wrap items-center justify-center md:justify-start gap-4'>
          <button
            onClick={() => onUpdate(row.original.id)}
            aria-label={`Update transaction ${row.original.memo}`}
            className='cursor-pointer rounded-md p-1 focus-primary'
          >
            <Pencil className='icon-md' />
          </button>

          <button
            onClick={() => onDelete(row.original)}
            aria-label={`Delete transaction ${row.original.memo}`}
            className='cursor-pointer rounded-md p-1 focus-primary'
          >
            <Trash2 className='icon-md' />
          </button>
        </div>
      ),
    },
  ];
  const { mutate } = useUpdateMultipleTransactions();

  const [newData, setNewData] = useState([]);
  const [isUnsavedData, setIsUnsavedData] = useState(false);
  const [saveErrors, setSaveErrors] = useState([]);

  const table = useReactTable({
    data: transactionsData?.transactions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // data is being fetched page by page
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page,
        pageSize: 50,
      },
    },
    meta: {
      initialData: transactionsData?.transactions,
      isUnsavedData,
      newData,
      updateData: (rowIndex, columnId, value) => {
        const originalRow = transactionsData?.transactions[rowIndex];
        if (!originalRow) return;
        const rowId = originalRow.id;

        setNewData(prev => {
          // find if row is already being tracked
          const existing = prev.find(row => row.id === rowId);

          if (existing) {
            // set current row data instead of creating a duplicate row for same row edit
            return prev.map(row => row.id === rowId ? { ...row, [columnId]: value } : row);
          } else {
            return [...prev, { ...originalRow, [columnId]: value }];
          }
        });
      },
    },
  });
  useEffect(() => {
    if (newData && newData.length > 0) {
      setIsUnsavedData(true);
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
    });


    if (errors.length > 0) {
      setSaveErrors(errors);
      return;
    }

    mutate(newData, {
      onSuccess: () => {
        setNewData([]);
        setSaveErrors([]);
      },
      onError: (error) => {
        setSaveErrors([{ id: 'api', memo: '', message: error.message || 'Failed to save changes.' }]);
      }
    });
  };

  const onCancel = () => {
    setNewData([]);
    setSaveErrors([]);
    setIsUnsavedData(false);
  };

  return (
    <> {saveErrors.map((error) => (
      <div className='form-error' role='alert'>
        <p key={error.id} >{error.message}</p>
      </div>
    ))}
      {isLoadingTransactions && <div className='my-2'><LoadingSpinner /></div>}
      <table className='mb-1.5 table-fixed w-full bg-canvas-card'>
        <caption className='sr-only'>Transactions</caption>
        <thead className='border-b border-soft bg-surface-muted'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='px-4 py-2 text-left text-small font-semibold text-txt-muted'>
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
        <tbody className='border-b border-soft'>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='px-4 py-2 text-left border-b border-soft'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isUnsavedData ? <div className='my-2'>
        <Button onClick={onSave}>Save</Button> <Button onClick={onCancel} intent='subtle'>Cancel</Button>
      </div>
        : null}

      {isUnsavedData ? null : <div className='flex gap-2 mt-2'>
        <PaginationControls
          page={page}
          totalPages={transactionsData?.totalPages}
          setPage={setPage}
          placeholder={isPlaceholderData}
        />
      </div>}
    </>
  );
}

export default TransactionTable;
