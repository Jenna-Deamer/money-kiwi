import DatePicker from 'react-datepicker';

function DatePickerField({ startDate, endDate, onChange }) {
  return (
    <DatePicker
      className='input-standard date-filter'
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      showIcon
      dateFormat='dd MMM yyyy'
      showMonthDropdown
      showYearDropdown
    />
  )
}

export default DatePickerField;
