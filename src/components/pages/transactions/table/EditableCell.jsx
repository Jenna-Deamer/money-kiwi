import { useState } from 'react';

const EditableCell = ({ getValue, table, row, column }) => {
    const initalValue = getValue();
    const [value, setValue] = useState(initalValue);

    return (
        <>
            <input value={value} onChange={e => setValue(e.target.value)} onBlur={() => { table.options.meta?.updateData(row.index, column.id, value); }} />
        </>
    );
};

export default EditableCell;