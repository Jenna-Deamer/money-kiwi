import { useState, useEffect } from 'react';
import { normalizeDateInputToLocalDate } from '@/utils/dateHelper';
import { transactionBaseSchema } from '@/utils/validation/transactionSchema';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const DateCell = ({ table, row }) => {

  const dateSchema = transactionBaseSchema.pick({ date: true });
  const [dateError, setDateError] = useState('');
  const [date, setDate] = useState(normalizeDateInputToLocalDate(row.original.date));

  const isUnsavedData = table.options.meta?.isUnsavedData;
  const editedRow = table.options.meta?.newData?.find(r => r.id === row.original.id);
  const isCellDirty = editedRow !== undefined &&
     date?.toISOString() !== normalizeDateInputToLocalDate(row.original.date)?.toISOString();

  useEffect(() => {
    if (!isUnsavedData) {
      setDate(normalizeDateInputToLocalDate(row.original.date));
      setDateError('');
    }
  }, [row.original.date, isUnsavedData]);

  const onBlur = (field, value) => {
    if (field === 'date') {
      const result = dateSchema.safeParse({ date: value });
      if (!result.success) {
        setDateError(result.error.issues[0].message);
      } else {
        setDateError('');
      }
    }
    if (value !== row.original[field]) table.options.meta?.updateData(row.index, field, value);
  };

  return (
    <div
      className={`${isCellDirty ? 'bg-red-50 border-l-2 border-red-500 pl-1' : 'bg-transparent border-l-0 pl-0'
        }`}
    >

      <DatePicker
      className='w-full text-left'
        onChange={(date) => {
          setDate(date);
        }}
        onBlur={() => {
          setDate(date);
          onBlur('date', date);
        }}
        selected={date}
        dateFormat='dd MMM yyyy'
        placeholderText='Select date'
      />
      {dateError && <small className='field-error'>{dateError}</small>}

    </div>
  );
};

export default DateCell;
