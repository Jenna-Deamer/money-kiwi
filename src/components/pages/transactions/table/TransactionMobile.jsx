import { normalizeDateInputToLocalDate } from '@/utils/dateHelper';
import { Pencil, Trash2 } from 'lucide-react';

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
      {data.map((tx) =>
        <div className='card p-3 mb-3' key={tx.id}>
          <div className='flex items-start justify-between gap-3'>
            <h3 className='font-semibold leading-tight'>{tx.memo}</h3>
            <p className='font-bold shrink-0'>${tx.amount.toFixed(2)}</p>
          </div>

          <div className='flex items-center gap-2 mt-2 text-sm'>
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

          <p className='text-sm'>
            {tx.account.institution} - {tx.account.name}
          </p>

          <div className='flex items-end justify-between gap-3 mt-3'>
            <p className='badge w-fit'>{tx.category.name}</p>

            <div className='flex gap-4'>
              <button onClick={() => onUpdate(tx.id)} aria-label='Update Transaction'>
                <Pencil size={20} />
              </button>
              <button onClick={() => onDelete(tx.id)} aria-label='Delete Transaction'>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export default TransactionMobile;
