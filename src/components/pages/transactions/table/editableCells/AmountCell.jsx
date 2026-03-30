import { useState, useEffect } from 'react';
import { transactionBaseSchema } from '../../../../../utils/validation/transactionSchema';

const AmountCell = ({ table, row }) => {
    const amountSchema = transactionBaseSchema.pick({ amount: true });
    const [amountError, setAmountError] = useState('');
    const [amount, setAmount] = useState(row.original.amount || 0.00);
    const [isFoucsed, setIsFocused] = useState(false);

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            // highlight edited row
            backgroundColor: isRowDirty ? '#fff5f5' : 'transparent',
            borderLeft: isRowDirty ? '2px solid red' : 'none',
            paddingLeft: isRowDirty ? '4px' : '0'
        }}>
            <input value={isFoucsed ? amount : amount.toFixed(2)}
                type='number'
                onChange={(e) => {
                    setAmount(parseFloat(e.target.value));
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false);
                    const value = parseFloat(e.target.value);
                    setAmount(value);
                    onBlur('amount', value);
                }}
                style={{
                    fontWeight: 'bold',
                    border: '1px solid transparent',
                    background: 'none',
                    width: '100%'
                }}
            />
            {amountError && <small style={{ color: 'red' }}>{amountError}</small>}

        </div>
    );
};

export default AmountCell;