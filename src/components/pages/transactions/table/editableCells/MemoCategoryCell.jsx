import { useState, useEffect } from 'react';
import { transactionBaseSchema } from '@/utils/validation/transactionSchema';
import { useChildrenCategories } from '@/hooks/useCategory';

const MemoCategoryCell = ({ row, table }) => {
  const memoSchema = transactionBaseSchema.pick({ memo: true });

  const transactionType = row.original.type;

  const [memoError, setMemoError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [memo, setMemo] = useState(row.original.memo);
  const [categoryId, setCategoryId] = useState(row.original.categoryId || '');
  const { data: { childrenCategories } = {}, isLoading } = useChildrenCategories(transactionType);

  const isUnsavedData = table.options.meta?.isUnsavedData;
  const initalRow = table.options.meta?.initialData?.find(r => r.id === row.original.id);
  const isRowDirty = (memo || '').trim() !== (initalRow?.memo || '').trim() ||
    (categoryId || '').trim() !== (initalRow?.categoryId || '').trim();


  useEffect(() => {
    if (!isUnsavedData) {
      setMemo(row.original.memo || '');
      setCategoryId(row.original.categoryId || '');
      setCategoryError('');
      setMemoError('');
    }

  }, [row.original.memo, row.original.categoryId, isUnsavedData]);

  // flags errors and tracks edited data when user leaves input
  const onBlur = (field, value) => {
    if (field === 'memo') {
      const result = memoSchema.safeParse({ memo: value });
      if (!result.success) {
        setMemoError(result.error.issues[0].message);
      } else {
        setMemoError('');
      }
    }

    // ensure a category is selected if type is not transfer
    if (field === 'categoryId') {
      if (row.original.type !== 'TRANSFER' && !value) {
        setCategoryError('A category is required');
      } else {
        setCategoryError('');
      }
    }
    if (value !== row.original[field]) table.options.meta?.updateData(row.index, field, value);

  };

  return (
    <div className={`flex flex-col ${isRowDirty ? 'bg-red-50 border-l-2 border-red-500 pl-1' : 'bg-transparent border-l-0 pl-0'
      }`}>
      <input
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        onBlur={() => onBlur('memo', memo)}
        className='font-bold'
      />
      {memoError && <small className='field-error'>{memoError}</small>}
      <select
        value={categoryId}
        onChange={(e) => {
          setCategoryId(e.target.value);
          onBlur('categoryId', e.target.value);
        }}
        disabled={isLoading}
        className='text-xs w-full cursor-pointer'
      >
        {childrenCategories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {categoryError && <small className='field-error'>{categoryError}</small>}
    </div>
  );
};

export default MemoCategoryCell;
