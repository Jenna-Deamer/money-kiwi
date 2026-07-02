import { normalizeDateInputToLocalDate } from '@/utils/dateHelper';

function TransactionMobile({
  transactionsData,
  onUpdate,
  onDelete,
  page,
  setPage,
  isPlaceholderData,
}) {
  console.log(transactionsData.transactions)
  const data = transactionsData.transactions;
  return (
    <>
      {data.map((tx) =>
        <div className='card py-2 px-4 mb-3' key={tx.id}>
          <div className='flex justify-between items-center'>
            <h3>{tx.memo}</h3>
            <b><span>$</span>{tx.amount}</b>
          </div>
          <p className='text-md mb-1'>{tx.type}</p>
          <p className='text-sm mb-1 border-b border-soft'>
            {normalizeDateInputToLocalDate(tx.date)?.toLocaleDateString('en-CA', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>

          <div>
            <p>{tx.account.institution} - {tx.account.name}</p>
            <p>{tx.category.name}</p>

          </div>

        </div>
      )}
    </>
  )
}


export default TransactionMobile;
