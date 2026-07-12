import DatePickerField from '../shared/ui/form/DatePickerField';
import { useAccounts } from '@/hooks/useAccounts';
import { useOutletContext } from 'react-router';

function Dashboard() {
  const { data: accounts, } = useAccounts();
  const [pickerRange, setPickerRange] = useOutletContext();

  const hasAccounts = accounts && accounts.length > 0;
  if (!accounts) return <div>Loading accounts...</div>;
    return (
        <section>
          <div className='md:text-left text-center'>
            <h1 className='mb-0.5'>Dashboard</h1>
            {hasAccounts && <DatePickerField
              startDate={pickerRange[0]}
              endDate={pickerRange[1]}
              onChange={(update) => {setPickerRange(update);}}
            />}
          </div>
      </section>

    );
}

export default Dashboard;
