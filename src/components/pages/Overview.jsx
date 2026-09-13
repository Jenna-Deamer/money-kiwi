import { fetchOverviewTransactionData } from '@/utils/api/overview';
import { useEffect, useState } from 'react';
import { normalizeDateInputToLocalDate } from '@/utils/dateHelper';

function Overview() {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchOverviewTransactionData()
      .then((response) => setData(response))
      .catch((error) => console.error(error));
  }, []);

  return (
    <section>
      <h1>{month} Summary</h1>

      <section className='grid sm:grid-cols-3 grid-cols-2 gap-4 mt-6'>
        <div className='card text-center'>
          <h3>Earned</h3>
          <p className='text-metric-md font-bold'>${data?.totals.income.toFixed(2)}</p>
        </div>
        <div className='card text-center sm:order-0 order-3 sm:col-span-1 col-span-full'>
          <h3>Remainder</h3>
          <p className='text-metric-md font-bold'>${data?.totals.cashflow.toFixed(2)}</p>
        </div>
        <div className='card text-center'>
          <h3>Spent</h3>
          <p className='text-metric-md font-bold'>${data?.totals.expense.toFixed(2)}</p>
        </div>
      </section>

      <section className='grid sm:grid-cols-2 grid-cols-1 gap-6 mt-10 items-start'>
        <div>
          <h3 className='mb-2'>Top Spending&nbsp;Categories</h3>
          <div className='card'>
            {data?.topExpenseCategories?.length ? (
              <ul className='divide-y divide-soft'>
                {data.topExpenseCategories.map((category) => (
                  <li key={category.id} className='flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0'>
                    <span className='flex items-center gap-3'>
                      <span
                        className='h-3 w-3 rounded-full shrink-0'
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span>{category.name}</span>
                    </span>
                    <span className='font-medium'>${category.sum.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-center py-4 text-txt-muted'>No expenses recorded yet this&nbsp;month</p>
            )}
          </div>

          <h3 className='mt-4 mb-2'>Total Saved &amp; Invested</h3>
          <div className='card'>
            <ul className='divide-y divide-soft'>
              <li className='flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0'><span>Saved</span> ${data?.totals.savingContributions.toFixed(2)}</li>
              <li className='flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0'><span>Invested</span> ${data?.totals.investmentsContributions.toFixed(2)}</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className='mb-2'>Upcoming Transactions</h3>
          <div className='card'>
            {data?.upcomingTransactions?.length ? (
              <ul className='divide-y divide-soft'>
                {data.upcomingTransactions.map((tx) => (
                  <li key={tx.id} className='flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{tx.memo}</span>
                      <span className='text-small text-txt-muted'>
                        {normalizeDateInputToLocalDate(tx.date)?.toLocaleDateString('en-CA', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                      <span className='font-medium'>${tx.amount.toFixed(2)}</span>
                      <span className='badge border-soft bg-black/3'>{tx.type}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-center py-4 text-txt-muted'>No upcoming transactions</p>
            )}
          </div>
        </div>
      </section>

    </section>
  );
}

export default Overview;
