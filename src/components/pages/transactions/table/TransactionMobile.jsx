import { normalizeDateInputToLocalDate } from '@/utils/dateHelper';
import { Pencil, Trash2 } from 'lucide-react';
import PaginationControls from './PaginationControls';

function TransactionMobile({
  transactionsData,
  onUpdate,
  onDelete,
  page,
  setPage,
  isPlaceholderData,
}) {
  const data = transactionsData.transactions;
  return (
    <>
      <h2 className='sr-only'>Transactions</h2>
      {data.map((tx) =>
        <div className='card-compact mb-3' key={tx.id}>
          <div className='flex items-start justify-between gap-3'>
            <h3 className='font-semibold leading-tight'>{tx.memo}</h3>
            <p className='font-bold shrink-0'>${tx.amount.toFixed(2)}</p>
          </div>

          <div className='flex items-center gap-2 mt-2 text-small text-txt-muted'>
            <p>{tx.type}</p>
            <span aria-hidden='true'>•</span>
            <p>
              {normalizeDateInputToLocalDate(tx.date)?.toLocaleDateString('en-CA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className='flex items-end gap-3 mt-3'>
            {tx.category?.name && (
              <p className='badge border-soft bg-black/3 w-fit'>{tx.category.name}</p>
            )}

            <div className='ml-auto flex gap-4'>
              <button onClick={() => onUpdate(tx.id)} aria-label={`Update transaction ${tx.memo}`} className='cursor-pointer rounded-md p-1 focus-primary'>
                <Pencil className='icon-md' />
              </button>
              <button onClick={() => onDelete(tx)} aria-label={`Delete transaction ${tx.memo}`} className='cursor-pointer rounded-md p-1 focus-primary'>
                <Trash2 className='icon-md' />
              </button>
            </div>
          </div>
        </div>
      )}
      <PaginationControls
        page={page}
        totalPages={transactionsData?.totalPages}
        setPage={setPage}
        placeholder={isPlaceholderData}
      />
    </>
  );
}


export default TransactionMobile;
