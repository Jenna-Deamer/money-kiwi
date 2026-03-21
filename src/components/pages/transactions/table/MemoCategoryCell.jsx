import { useState, useEffect } from 'react';

const MemoCategoryCell = ({ row, table }) => {
    const [memo, setMemo] = useState(row.original.memo);
    const [category, setCategory] = useState(row.original.category || '');

    const initalRow = table.options.meta?.initialData?.[row.index];
    const isRowDirty = memo !== initalRow?.memo || category != initalRow?.category;


    useEffect(() => {
        setMemo(row.original.memo);
        setCategory(row.original.category || '');
    }, [row.original.memo, row.original.category]);

    // flags changes in two different database columns.
    const onBlur = (field, value) => {
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
            <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                onBlur={() => onBlur('memo', memo)}
                style={{
                    fontWeight: 'bold',
                    border: '1px solid transparent',
                    background: 'none',
                    width: '100%'
                }}
            />

            <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    onBlur('category', e.target.value);
                }}
                style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    border: 'none',
                    background: 'none'
                }}
            >
                <option value="food">Food</option>
                <option value="savings">Savings</option>
            </select>
        </div>
    );
};

export default MemoCategoryCell;