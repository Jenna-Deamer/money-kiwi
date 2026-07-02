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
import { useUpdateMultipleTransactionss } from '@/hooks/useTransaction';
import { toast } from 'sonner';
import { Pencil,Trash2 } from 'lucide-react';
import Button from '@/components/shared/ui/buttons/Button';

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
          <small className='text-xs font-light'>{row.original.status}</small>
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
        <div className='flex gap-4'justify-between>
          <button onClick={() => onUpdate(row.original.id)} aria-label='Update Transaction' className='cursor-pointer'><Pencil/></button>
          <button onClick={() => onDelete(row.original)} aria-label='Delete Transaction' className='cursor-pointer'><Trash2/></button>
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
          // find if row is already being tracked
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
      toast.error('Error: Please address fields highlighted in red before saving changes.');
      return;
    }

    mutate(newData, {
      onSuccess: () => {
        setNewData([]);
        setSaveErrors([]);
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
      <div className='form-error'>
        <p key={error.id} >{error.message}</p>
      </div>
    ))}
      <table className='mt-6 mb-1.5 table-fixed w-full bg-white'>
        <thead className='border-b border-soft bg-gray-200'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='px-4 py-2 text-left'>
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

      <div
        className={`my-2 flex gap-3 transition-opacity duration-100 ease-in-out ${
          isUnsavedData ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Button onClick={onSave}>Save</Button>
        <Button onClick={onCancel} intent="subtle">Cancel</Button>
      </div>

      <div>
        <span>Current Page: {page + 1}</span>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous Page
        </button>
        <button
          onClick={() => {
            if (!isPlaceholderData && transactionsData.totalPages) {
              setPage((prev) => prev + 1);
            }
          }}
          disabled={isPlaceholderData || page >= transactionsData?.totalPages - 1}
        >
          Next Page
        </button>
      </div >

    </>
  );
}

export default TransactionTable;
