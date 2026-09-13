import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import range from 'lodash/range';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEARS_AHEAD = 2;
const years = range(2020, getYear(new Date()) + YEARS_AHEAD + 1, 1);

export const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <>
    <div
      className='flex justify-center items-center p-1 mx-2'
    >
      <button type='button' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        <ChevronLeft className='icon-md cursor-pointer' />
      </button>

      <select
        className='input-standard mx-2 w-fit'
        value={getYear(date)}
        onChange={({ target: { value } }) => changeYear(Number(value))}
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        className='input-standard mx-2'
        value={MONTHS[getMonth(date)]}
        onChange={({ target: { value } }) => changeMonth(MONTHS.indexOf(value))}
      >
        {MONTHS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button type='button' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        <ChevronRight className='icon-md cursor-pointer' />
      </button>
    </div>
  </>

);

export function RenderCustomHeader() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      renderCustomHeader={(props) => <CustomHeader {...props} />}
    />
  );
}

function DatePickerField({ startDate, endDate, onChange }) {
  return (
    <DatePicker
      className='input-standard date-filter'
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      showIcon
      dateFormat='dd MMM yyyy'
      renderCustomHeader={(props) => <CustomHeader {...props} />}
    />
  );
}

export default DatePickerField;
