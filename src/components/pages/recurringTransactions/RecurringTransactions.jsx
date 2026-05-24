import { useRecurringTransaction } from '@/context/useRecurringTransaction';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';

function RecurringTransactions() {
  const { data, isLoading, error } = useRecurringTransaction();

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error: {error}</div>
  console.log(data);
  return (
    <>
      <h1>Recurring Transactions Overview</h1>
      <div>
      </div>
      <section>
        {data?.map(tx => (
          <div key={tx.id}>
            <h3>{tx.memo}</h3>
            <div>
              <div>
                <button>Edit</button>
                <button>Pause</button>
                <button>Delete</button>
              </div>
              <p>{tx.type} ${tx.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}


export default RecurringTransactions;
