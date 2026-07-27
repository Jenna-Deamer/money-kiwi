import DatePickerField from '../../shared/ui/form/DatePickerField';
import { useAccounts } from '@/hooks/useAccounts';
import { useOutletContext } from 'react-router';
import TabButtons from '@/components/shared/ui/buttons/TabButtons';
import { useState } from 'react';

function Dashboard() {
  const { data: accounts, } = useAccounts();
  const [pickerRange, setPickerRange] = useOutletContext();
  const tabs = [
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'invesments', label: 'Invesments' },
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
          onChange={(update) => { setPickerRange(update); }}
        />}
      </div>

      <div className='flex justify-center items-center md:justify-start'>
        <TabButtons
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        /></div>

      <h2 className='py-4'>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>

    </section>

  );
}

export default Dashboard;
