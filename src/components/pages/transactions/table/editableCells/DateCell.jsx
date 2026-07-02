import { useState, useEffect } from 'react';
import { transactionBaseSchema } from '@/utils/validation/transactionSchema';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const DateCell = ({ table, row }) => {
  const parseDateAsLocal = (dateInput) => {
    const d = new Date(dateInput);
    // Use UTC values so timezone shift doesn't move the calendar day
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  };

  const dateSchema = transactionBaseSchema.pick({ date: true });
  const [dateError, setDateError] = useState('');
  const [date, setDate] = useState(parseDateAsLocal(row.original.date));

  const isUnsavedData = table.options.meta?.isUnsavedData;
  const initalRow = table.options.meta?.initialData?.find(r => r.id === row.original.id);
  const isRowDirty = date?.toISOString() !== parseDateAsLocal(initalRow?.date)?.toISOString();

  useEffect(() => {
    if (!isUnsavedData) {
      setDate(parseDateAsLocal(row.original.date));
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

    table.options.meta?.updateData(row.index, field, value);
  };

  return (
    <div
      className={`${isRowDirty ? 'bg-red-50 border-l-2 border-red-500 pl-1' : 'bg-transparent border-l-0 pl-0'
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
        dateFormat="dd MMM yyyy"
        placeholderText="Select date"
      />
      {dateError && <small className='field-error'>{dateError}</small>}

    </div>
  );
};

export default DateCell;
