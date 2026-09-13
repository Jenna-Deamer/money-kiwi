import DatePickerField from '../../shared/ui/form/DatePickerField';
import { useAccounts } from '@/hooks/useAccounts';
import { useCashflowAnalytics } from '@/hooks/useAnalytics';
import { useInvestmentsAnalytics } from '@/hooks/useAnalytics';
import { useOutletContext } from 'react-router';
import TabButtons from '@/components/shared/ui/buttons/TabButtons';
import { useState } from 'react';
import DashboardPieChartSection from '@/components/shared/ui/dashboard/PieChartSection';

function Dashboard() {
  const { data: accounts, } = useAccounts();
  const [pickerRange, setPickerRange] = useOutletContext();
  const { data: cashflowData, } = useCashflowAnalytics(pickerRange);
  const { data: investmentsData, } = useInvestmentsAnalytics(pickerRange);

  const tabs = [
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'investments', label: 'Investments' },
  ];
  const [activeTab, setActiveTab] = useState('cashflow');

  const hasAccounts = accounts && accounts.length > 0;
  if (!accounts) return <div>Loading accounts...</div>;

  return (
    <section>
      <div className='flex md:flex-row justify-between flex-col gap-2 items-center mb-6'>
        <h1>Dashboard</h1>
        {hasAccounts && <DatePickerField
          startDate={pickerRange[0]}
          endDate={pickerRange[1]}
          onChange={(update) => {
            setPickerRange(update);
          }}
        />}
      </div>

      <div className='flex justify-center items-center md:justify-start mb-6'>
        <TabButtons
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        /></div>

      {activeTab === 'cashflow' ?
        <div>
          <section>
            <h2 className='mb-2'>Summary</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {/* Featured Hero Card */}
              <div className='card flex flex-col justify-between sm:col-span-2 lg:col-span-2'>
                <span className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                  Net Remainder
                </span>
                <p className='text-metric-lg font-extrabold mt-2'>
                  ${cashflowData?.totals.cashflow.toFixed(2)}
                </p>
              </div>

              {/* Primary Metrics */}
              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                  Earned
                </span>
                <p className='text-metric-md font-bold mt-2'>
                  ${cashflowData?.totals.income.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                  Spent
                </span>
                <p className='text-metric-md font-bold mt-2'>
                  ${cashflowData?.totals.expenseBeforeTransfers.toFixed(2)}
                </p>
              </div>

              {/* Secondary Metrics */}
              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-medium text-txt-muted'>Saved</span>
                <p className='text-metric-sm font-semibold mt-1'>
                  ${cashflowData?.totals.savingContributions.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-medium text-txt-muted'>Invested</span>
                <p className='text-metric-sm font-semibold mt-1'>
                  ${cashflowData?.totals.investmentsContributions.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-medium text-txt-muted'>Transfers</span>
                <p className='text-metric-sm font-semibold mt-1'>
                  ${cashflowData?.totals.transfers.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-medium text-txt-muted'>Debt Payments</span>
                <p className='text-metric-sm font-semibold mt-1'>
                  ${cashflowData?.totals.liabilitiesPayments.toFixed(2)}
                </p>
              </div>
            </div>
          </section>


          <section className='mt-6'>
            {cashflowData?.categories.expenseCategories.length === 0 ? (
              <div className='card w-fit'>
                <p className='text-txt-muted'>No <b>expense</b> data found. Please try another date&nbsp;range.</p>
              </div>
            ) : (
              <DashboardPieChartSection
                data={cashflowData?.categories.expenseCategories}
                dataKey='sum'
                title='Expenses'
                valueLabel='Breakdown'
              />
            )}
          </section>

          <section className='mt-6'>
            {cashflowData?.categories.incomeCategories.length === 0 ? (
              <div className='card w-fit'>
                <p className='text-txt-muted'>No <b>income</b> data found. Please try another date&nbsp;range.</p>
              </div>
            ) : (
              <DashboardPieChartSection
                data={cashflowData?.categories.incomeCategories}
                dataKey='sum'
                title='Income'
                valueLabel='Breakdown'
              />
            )}
          </section>

        </div> : <></>
      }

      {activeTab === 'investments' ?
        <div>
          <section>
            <h2 className='mb-4'>Summary</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {/* Featured Hero Card */}
              <div className='card flex flex-col justify-between sm:col-span-2 lg:col-span-2'>
                <span className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                  Net Remainder
                </span>
                <p className='text-metric-lg font-extrabold mt-2'>
                  ${investmentsData?.totals.net.toFixed(2)}
                </p>
              </div>

              {/* Primary Metrics */}
              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                  Invested
                </span>
                <p className='text-metric-md font-bold mt-2'>
                  ${investmentsData?.totals.contributions.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between'>
                <span className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                  Withdrawn
                </span>
                <p className='text-metric-md font-bold mt-2'>
                  ${investmentsData?.totals.withdrawals.toFixed(2)}
                </p>
              </div>
            </div>
          </section>
          <section className='mt-6 mb-2'>
            {investmentsData?.contributionsByRegistration.length === 0 ? (
              <div className='card'>
                <p className='text-txt-muted'>No <b>expense</b> data found. Please try another date&nbsp;range.</p>
              </div>
            ) : (
              <DashboardPieChartSection
                data={investmentsData?.contributionsByRegistration}
                dataKey='amount'
                nameKey='registration'
                sumKey='amount'
                percentageKey='parentPercentage'
                title='Investments by Registration'
                valueLabel='Breakdown'
              />
            )}
          </section>
          <section className='card mt-6'>
            {investmentsData?.accountActivity.length === 0 ? (
              <p className='text-txt-muted'>
                No <b>account</b> data found. Please try another date&nbsp;range.
              </p>
            ) : (
              <div>
                <div className='border-b border-soft pb-3 mb-6'>
                  <h2>Account Activity Breakdown</h2>
                  <p className='text-txt-muted mt-1 text-small'>
                    Individual performance and flows across all accounts
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                  {[...investmentsData.accountActivity]
                    .sort((a, b) => (a.registration || '').localeCompare(b.registration || ''))
                    .map((account) => (
                      < div
                        key={account.accountId}
                        className='border border-soft rounded-xl p-4 flex flex-col'
                      >
                        <div className='flex justify-between items-start mb-4 border-b border-soft pb-4'>
                          <div>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                                {account.institution}
                              </span>
                              <span className='badge border-soft'>
                                {account.registration}
                              </span>
                            </div>
                            <h4>
                              {account.accountName}
                            </h4>
                          </div>
                          <div className='text-right'>
                            <p className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                              Net
                            </p>
                            <p className={`font-bold mt-0.5 text-metric-sm ${account.net >= 0 ? 'text-income' : 'text-expense'}`}>
                              ${account.net.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3 mt-auto'>
                          <div>
                            <p className='text-xs text-txt-muted mb-1'>Contributions</p>
                            <p className='font-semibold'>
                              ${account.contributions.toFixed(2)}
                            </p>
                            <p className='text-xs text-income mt-1 font-medium'>
                              {account.contributionPercentage}% of total
                            </p>
                          </div>
                          <div>
                            <p className='text-xs text-txt-muted mb-1'>Withdrawals</p>
                            <p className='font-semibold'>
                              ${account.withdrawals.toFixed(2)}
                            </p>
                            <p className='text-xs text-expense mt-1 font-medium'>
                              {account.withdrawalPercentage}% of total
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        </div> : <></>
      }
    </section>

  );
}

export default Dashboard;
