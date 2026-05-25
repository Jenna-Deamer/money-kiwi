import { useRecurringTransaction } from '@/context/useRecurringTransaction';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';

function RecurringTransactions() {
  const { data, isLoading, error } = useRecurringTransaction();

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <h1>Recurring Transactions Overview</h1>
      <div>
      </div>
      <section>
        {FREQUENCIES?.map(freq => (
          <div key={freq.label}>
            <h3>{freq.label}</h3>
            {data?.map(tx => (
              tx.frequency === freq.value &&
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
          </div>
        ))}

      </section>
    </>
  )
}


export default RecurringTransactions;
