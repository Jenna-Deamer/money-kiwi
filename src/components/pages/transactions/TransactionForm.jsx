import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../../../utils/validation/transactionSchema';
import { useCreateTransaction, useGetTransaction, useUpdateTransaction } from '../../../context/useTransaction';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const validTypes = ['Income', 'Expense', 'Transfer'];

function TransactionForm() {
    const { id } = useParams();
    let isEditMode = false;
    if (id) { isEditMode = true; };

    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const { mutate: createTransaction, isLoading: isCreating } = useCreateTransaction();
    const { mutate: updateTransaction, isLoading: isUpdating } = useUpdateTransaction();
    const { data: existingTransaction, isLoading: isFetching } = useGetTransaction(id);

    const { register, handleSubmit, watch, reset, control,
        setValue, formState: { errors } } = useForm({
            resolver: zodResolver(transactionSchema),
            defaultValues: { memo: '', type: '', amount: '', date: new Date(), category: '', status: 'POSTED' }
        });

    const selectedType = watch('type');


    useEffect(() => {
        if (isEditMode && existingTransaction) {
            reset(existingTransaction);
        };
    }, [isEditMode, existingTransaction, reset]);

    const onSubmit = async (data) => {
        setServerError('');

        const mutation = isEditMode ? updateTransaction : createTransaction;

        const payload = isEditMode ? { ...data, id } : data;

        mutation(payload, {
            onSuccess: () => navigate('/transactions'),
            onError: (err) => setServerError(err.message)
        });
    };

    if (isEditMode && isFetching) {
        return <p>Loading account details...</p>;
    }

    return (
        <>
            {!isEditMode && <h1>Create Transaction</h1>}
            {isEditMode && <h1>Update Transaction</h1>}

            <form onSubmit={handleSubmit(onSubmit)}>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <fieldset>
                    <label>Memo</label>
                    <div className='input-group'>
                        <input {...register('memo')} placeholder='Memo' />
                        {errors.memo && <span className='error'>{errors.memo.message}</span>}
                    </div>

                    <label>Amount</label>
                    <div className='input-group'>
                        <input type='number' {...register('amount')} placeholder='Amount' min={0.01} />
                        {errors.amount && <span className='error'>{errors.amount.message}</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <label>Type</label>
                    <div className='input-group'>
                        <select {...register('type')}>
                            <>
                                <option value=''>-- Select Type --</option>
                                {validTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </>
                            {errors.type && <span className='error'>{errors.type.message}</span>}

                        </select>
                    </div>

                    <label>Category</label>
                    <div className='input-group'>
                        <select {...register('category')} disabled={!selectedType}>
                            {!selectedType ? (
                                <option value=''>-- Select Type First --</option>

                            ) : (
                                <>
                                    <option value=''>-- Select Category --</option>
                                    <option value='food'>Food</option>
                                </>
                            )}
                            {errors.category && <span className='error'>{errors.category.message}</span>}

                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <label>Date</label>
                    <div className='input-group'>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <DatePicker
                                    onChange={onChange} // Standardizes the custom date object for RHF
                                    onBlur={onBlur}
                                    selected={value}
                                    inputRef={ref}
                                    dateFormat="dd MMMM yyyy"
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