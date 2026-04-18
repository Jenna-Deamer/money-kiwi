import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../../../utils/validation/transactionSchema';
import { useCreateTransaction, useGetTransaction, useUpdateTransaction } from '../../../context/useTransaction';
import { useChildrenCategories } from '../../../context/useCategory';
import { useAccounts } from '../../../context/useAccounts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const validTypes = ['INCOME', 'EXPENSE', 'TRANSFER'];
const toLocalDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

function TransactionForm() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const preSelectedAccount = searchParams.get('accountId');
    const { data, isLoading, error } = useAccounts();

    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const { mutate: createTransaction, isLoading: isCreating } = useCreateTransaction();
    const { mutate: updateTransaction, isLoading: isUpdating } = useUpdateTransaction();
    const { data: existingTransaction, isLoading: isFetching } = useGetTransaction(id);

    const { register, handleSubmit, watch, reset, control, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            accountId: preSelectedAccount || '',
            memo: '',
            type: '',
            amount: '',
            date: new Date(),
            categoryId: '',
            status: 'POSTED',
            toAccountId: ''
        }
    });

    const selectedType = watch('type');
    const sourceAccountId = watch('accountId');

    const { data: { childrenCategories } = {}, isLoading: isLoadingCategories, error: categoryError } = useChildrenCategories(selectedType);

    useEffect(() => {
        if (isEditMode && existingTransaction) {
            const normalized = { ...existingTransaction };

            if (normalized.date && typeof normalized.date === 'string') {
                normalized.date = new Date(normalized.date);
            }

            reset(normalized);
        }
    }, [isEditMode, existingTransaction, reset]);

    useEffect(() => {
        if (selectedType !== 'TRANSFER') {
            setValue('toAccountId', '');
        }
    }, [selectedType, setValue]);

    const onSubmit = async (formData) => {
        setServerError('');

        const formattedDate = formData.date instanceof Date
            ? toLocalDateString(formData.date)
            : formData.date;

        const payload = isEditMode
            ? { ...formData, date: formattedDate, id }
            : { ...formData, date: formattedDate };

        const mutation = isEditMode ? updateTransaction : createTransaction;

        mutation(payload, {
            onSuccess: () => navigate('/transactions'),
            onError: (err) => setServerError(err.message)
        });
        console.log('formData.date:', formData.date);
        console.log('formattedDate being sent:', formattedDate);
    };

    if (isEditMode && isFetching) {
        return <p>Loading transaction details...</p>;
    }

    return (
        <>
            <h1>{isEditMode ? 'Update Transaction' : 'Create Transaction'}</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

                <fieldset>
                    <div>
                        <label>Source Account</label>
                        {isLoading && <small>Loading...</small>}
                        {error && <small style={{ color: 'red' }}>Error retriving accounts!</small>}
                    </div>

                    <div className='input-group'>
                        <select {...register('accountId')} disabled={isLoading || !!error}>
                            <option value=''>-- Select Source Account --</option>
                            {data?.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                        {errors.accountId && <span className='error'>{errors.accountId.message}</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <label>Memo</label>
                    <div className='input-group'>
                        <input {...register('memo')} placeholder='e.g. Starbucks' />
                        {errors.memo && <span className='error'>{errors.memo.message}</span>}
                    </div>

                    <label>Amount</label>
                    <div className='input-group'>
                        <input type='number' step="0.01" {...register('amount')} placeholder='0.00' />
                        {errors.amount && <span className='error'>{errors.amount.message}</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <label>Transaction Type</label>
                    <div className='input-group'>
                        <select {...register('type')}>
                            <option value=''>-- Select Type --</option>
                            {validTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type && <span className='error'>{errors.type.message}</span>}
                    </div>

                    {selectedType !== 'TRANSFER' && (
                        <>
                            <label>Category</label>

                            <div className='input-group'>
                                {isLoadingCategories && <small>Loading categories...</small>}
                                {categoryError && <small style={{ color: 'red' }}>Error retrieving categories!</small>}
                                <select {...register('categoryId')} disabled={!selectedType}>
                                    {!selectedType ? (
                                        <option value=''>-- Select Type First --</option>
                                    ) : (
                                        <>
                                            <option value=''>-- Select Category --</option>
                                            {childrenCategories?.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                {errors.categoryId && <span className='error'>{errors.categoryId.message}</span>}
                            </div>
                        </>
                    )}
                </fieldset>

                {selectedType === 'TRANSFER' && (
                    <fieldset>
                        <div>
                            <label>Destination Account</label>
                            {isLoading && <small>Loading accounts...</small>}
                            {error && <small style={{ color: 'red' }}>Error retriving accounts!</small>}
                        </div>

                        <div className='input-group'>
                            <select {...register('toAccountId')} disabled={isLoading || !!error}>
                                <option value=''>-- Select Destination Account --</option>
                                {data?.filter(acc => acc.id !== sourceAccountId)
                                    .map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                            </select>
                            {errors.toAccountId && (
                                <span className='error'>{errors.toAccountId.message}</span>
                            )}
                        </div>
                    </fieldset>
                )}

                <fieldset>
                    <label>Date</label>
                    <div className='input-group'>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <DatePicker
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    selected={value}
                                    inputRef={ref}
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="Select date"
                                />
                            )}
                        />
                        {errors.date && <span className='error'>{errors.date.message}</span>}
                    </div>
                </fieldset>

                <button type='submit' disabled={isCreating || isUpdating || isFetching}>
                    {isEditMode ? 'Update Transaction' : 'Create Transaction'}
                </button>
            </form>
        </>
    );
}

export default TransactionForm;