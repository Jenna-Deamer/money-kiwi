import { useState, useEffect } from 'react';
import { transactionBaseSchema } from '@/utils/validation/transactionSchema';

const AmountCell = ({ table, row }) => {
  const amountSchema = transactionBaseSchema.pick({ amount: true });
  const [amountError, setAmountError] = useState('');
  const [amount, setAmount] = useState(row.original.amount || 0.00);
  const [isFocused, setIsFocused] = useState(false);

  const isUnsavedData = table.options.meta?.isUnsavedData;
  const initalRow = table.options.meta?.initialData?.find(r => r.id === row.original.id); const isRowDirty = (amount || 0.00) !== (initalRow?.amount || 0.00);

  useEffect(() => {
    if (!isUnsavedData) {
      setAmount(row.original.amount || 0.00);
      setAmountError('');
    }
  }, [row.original.amount, isUnsavedData]);

  const onBlur = (field, value) => {
    if (field === 'amount') {
      const result = amountSchema.safeParse({ amount: value });
      if (!result.success) {
        setAmountError(result.error.issues[0].message);
      } else {
        setAmountError('');
      }
    }

    table.options.meta?.updateData(row.index, field, value);
  };

  return (
    <div className={`${isRowDirty ? 'bg-red-50 border-l-2 border-red-500 pl-1' : 'bg-transparent border-l-0 pl-0'
      }`}>
        <input
          value={isFocused ? amount : amount.toFixed(2)}
          type='number'
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            const value = parseFloat(e.target.value);
            setAmount(value);
            onBlur('amount', value);
          }}
          className='w-full font-bold border border-transparent bg-transparent
            [appearance:textfield]
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none
            focus:[&::-webkit-inner-spin-button]:appearance-auto
            focus:[&::-webkit-outer-spin-button]:appearance-auto'
        />
      {amountError && <small className='field-error'>{amountError}</small>}

    </div>
  );
};

export default AmountCell;
