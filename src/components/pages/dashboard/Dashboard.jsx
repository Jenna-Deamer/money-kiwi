import DatePickerField from '../../shared/ui/form/DatePickerField';
import { useAccounts } from '@/hooks/useAccounts';
import { useCashflowAnalytics } from '@/hooks/useAnalytics';
import { useOutletContext } from 'react-router';
import TabButtons from '@/components/shared/ui/buttons/TabButtons';
import { useState } from 'react';
import DashboardPieChart from '@/components/shared/ui/PieChart';

function Dashboard() {
  const { data: accounts, } = useAccounts();
  const [pickerRange, setPickerRange] = useOutletContext();
  const { data: cashflowData, } = useCashflowAnalytics(pickerRange);

  const tabs = [
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'investments', label: 'Investments' },
  ];
  const [activeTab, setActiveTab] = useState('cashflow');

  const hasAccounts = accounts && accounts.length > 0;
  if (!accounts) return <div>Loading accounts...</div>;

  return (
    <section>
      <div className='flex md:flex-row justify-between pb-1.5 flex-col gap-2 items-center mb-2'>
        <h1 className='mb-0.5'>Dashboard</h1>
        {hasAccounts && <DatePickerField
          startDate={pickerRange[0]}
          endDate={pickerRange[1]}
          onChange={(update) => {
            setPickerRange(update);
          }}
        />}
      </div>

      <div className='flex justify-center items-center md:justify-start mb-8'>
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
              <div className='card flex flex-col justify-between p-5 sm:col-span-2 lg:col-span-2'>
                <span className='text-xs font-semibold uppercase tracking-wider'>
                  Net Remainder
                </span>
                <p className='text-3xl font-extrabold mt-2'>
                  ${cashflowData?.totals.cashflow.toFixed(2)}
                </p>
              </div>

              {/* Primary Metrics */}
              <div className='card flex flex-col justify-between p-5'>
                <span className='text-xs font-semibold uppercase tracking-wider'>
                  Earned
                </span>
                <p className='text-2xl font-bold mt-2'>
                  ${cashflowData?.totals.income.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between p-5'>
                <span className='text-xs font-semibold uppercase tracking-wider'>
                  Spent
                </span>
                <p className='text-2xl font-bold mt-2'>
                  ${cashflowData?.totals.expenseBeforeTransfers.toFixed(2)}
                </p>
              </div>

              {/* Secondary Metrics */}
              <div className='card flex flex-col justify-between p-4'>
                <span className='text-xs font-medium'>Saved</span>
                <p className='text-lg font-semibold mt-1'>
                  ${cashflowData?.totals.savingContributions.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between p-4'>
                <span className='text-xs font-medium'>Invested</span>
                <p className='text-lg font-semibold mt-1'>
                  ${cashflowData?.totals.investmentsContributions.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between p-4'>
                <span className='text-xs font-medium'>Transfers</span>
                <p className='text-lg font-semibold mt-1'>
                  ${cashflowData?.totals.transfers.toFixed(2)}
                </p>
              </div>

              <div className='card flex flex-col justify-between p-4'>
                <span className='text-xs font-medium'>Debt Payments</span>
                <p className='text-lg font-semibold mt-1'>
                  ${cashflowData?.totals.liabilitiesPayments.toFixed(2)}
                </p>
              </div>
            </div>
          </section>
          <section className='mt-6'>
            {cashflowData?.categories.expenseCategories.length === 0 ? (
              <div className='card w-fit'>
                <p>No <b>expense</b> data found. Please try another date&nbsp;range.</p>
              </div>
            ) : (
              <div className='card'>
                <div className='border-b border-soft pb-3 mb-4'>
                  <h2 className='text-h2 font-semibold text-txt-main'>Expenses</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
                  <div className='flex items-center justify-center h-70'>
                    <DashboardPieChart
                      data={cashflowData?.categories.expenseCategories}
                      dataKey='sum'
                    />
                  </div>
                  <div className='h-full'>
                    <h3 className='text-sm font-bold uppercase tracking-wider text-txt-muted mb-3'>
                      Breakdown
                    </h3>

                    <div className='space-y-3'>
                      {cashflowData?.categories.expenseCategories.map((category, index) => (
                        <div key={index} className='space-y-1'>
                          <div className='flex items-center justify-between text-body font-bold text-txt-main'>
                            <div className='flex items-center gap-2.5'>
                              <span
                                className='w-3 h-3 rounded-full inline-block shrink-0'
                                style={{ backgroundColor: category.fill || category.color || '#ccc' }}
                              />
                              <span>{category.name}</span>
                            </div>

                            <div className='flex items-center gap-3'>
                              <span>${category.sum.toFixed(2)}</span>
                              <span className='text-small font-semibold text-txt-main w-12 text-right'>
                                {category.parentPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          {category.children && category.children.length > 0 && (
                            <div className='pl-5 space-y-1'>
                              {category.children.map((child, childIdx) => (
                                <div
                                  key={childIdx}
                                  className='flex items-center justify-between text-small text-txt-main'
                                >
                                  <span className='text-txt-muted'>{child.name}</span>
                                  <div className='flex items-center gap-3'>
                                    <span>${child.sum.toFixed(2)}</span>
                                    <span className='text-txt-muted w-12 text-right'>
                                      {child.childPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className='mt-6'>
            {cashflowData?.categories.incomeCategories.length === 0 ? (
              <div className='card w-fit'>
                <p>No <b>income</b> data found. Please try another date&nbsp;range.</p>
              </div>
            ) : (
              <div className='card'>
                <div className='border-b border-soft pb-3 mb-4'>
                  <h2 className='text-h2 font-semibold text-txt-main'>Income</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
                  <div className='flex items-center justify-center h-70'>
                    <DashboardPieChart
                      data={cashflowData?.categories.incomeCategories}
                      dataKey='sum'
                    />
                  </div>
                  <div className='h-full'>
                    <h3 className='text-sm font-bold uppercase tracking-wider text-txt-muted mb-3'>
                      Breakdown
                    </h3>

                    <div className='space-y-3'>
                      {cashflowData?.categories.incomeCategories.map((category, index) => (
                        <div key={index} className='space-y-1'>
                          <div className='flex items-center justify-between text-body font-bold text-txt-main'>
                            <div className='flex items-center gap-2.5'>
                              <span
                                className='w-3 h-3 rounded-full inline-block shrink-0'
                                style={{ backgroundColor: category.fill || category.color || '#ccc' }}
                              />
                              <span>{category.name}</span>
                            </div>

                            <div className='flex items-center gap-3'>
                              <span>${category.sum.toFixed(2)}</span>
                              <span className='text-small font-semibold text-txt-main w-12 text-right'>
                                {category.parentPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          {category.children && category.children.length > 0 && (
                            <div className='pl-5 space-y-1'>
                              {category.children.map((child, childIdx) => (
                                <div
                                  key={childIdx}
                                  className='flex items-center justify-between text-small text-txt-main'
                                >
                                  <span className='text-txt-muted'>{child.name}</span>
                                  <div className='flex items-center gap-3'>
                                    <span>${child.sum.toFixed(2)}</span>
                                    <span className='text-txt-muted w-12 text-right'>
                                      {child.childPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
