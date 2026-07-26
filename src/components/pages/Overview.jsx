import { fetchOverviewTransactionData } from '@/utils/api/overview';
import { useEffect, useState } from 'react';



function Overview() {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchOverviewTransactionData()
      .then((response) => {
        setData(response);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <section>
      <h1>{month} Summary</h1>
      <section className='grid sm:grid-cols-3 grid-cols-2 gap-4 text-center mt-6'>
        <div className='card'>
          <h3>Earned</h3>
          <p>${data?.totals.income.toFixed(2)}</p>
        </div>
        <div className='card sm:order-0 order-3 sm:col-span-1 col-span-full'>
          <h3>Remainder</h3>
          <p>${data?.totals.cashflow.toFixed(2)}</p>
        </div>
        <div className='card'>
          <h3>Spent</h3>
          <p>${data?.totals.expense.toFixed(2)}</p>
        </div>
      </section>


      <section className='flex sm:flex-row justify-center flex-col gap-6 mt-10'>

        <div className='w-full'>
          <h3 className='mb-2'>Top Spending&nbsp;Categories</h3>

          <div className='card'>
            {data?.topExpenseCategories ? <ul>
              {data?.topExpenseCategories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul> : <p>No expenses recorded yet this month</p>}

          </div>
        </div>

        <div className='w-full'>
          <h3 className='mb-2'>Upcoming Transactions</h3>

          <div className='card'>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Overview;
